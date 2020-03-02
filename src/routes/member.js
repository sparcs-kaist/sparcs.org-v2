const adminRequired = require('../middlewares/adminRequired');
const axios = require('axios');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const config = require('../../config.json');
const sparcsRequired = require('../middlewares/sparcsRequired');

const { CookieJar } = require('tough-cookie');
const Router = require('@koa/router');

const memvers = axios.create({
    baseURL: config.memversUrl,
    validateStatus: false
});

axiosCookieJarSupport(memvers);

const router = new Router();
const cache = { lastUpdate: 0 };
const projection = {
    id: true, name: true, is_developer: true, is_designer: true, is_undergraduate: true,
    github_id: true, linkedin_url: true, behance_url: true, website: true
};

router.get('/', async ctx => {
    const users = await ctx.db
        .collection('members')
        .find({ is_private: false }, { projection })
        .toArray();

    ctx.body = users;
});

router.get('/count', async ctx => {
    if(cache.lastUpdate + 24 * 60 * 60 * 1000 < Date.now()) {
        const aggregate = await ctx.db
            .collection('members')
            .aggregate(
                { group: {
                    _id: null,
                    developer: { $sum: {
                        $cond: { if: '$is_developer', then: 1, else: 0 }
                    } },
                    developer_under: { $sum: {
                        $cond: {
                            if: { $and: ['$is_developer', '$is_undergraduate'] },
                            then: 1,
                            else: 0
                        }
                    } },
                    designer: { $sum: {
                        $cond: { if: '$is_designer', then: 1, else: 0 }
                    } },
                    designer_under: { $sum: {
                        $cond: {
                            if: { $and: ['$is_designer', '$is_undergraduate'] },
                            then: 1,
                            else: 0
                        }
                    } },
                    all: { $sum: 1 },
                    under: { $sum: {
                        $cond: { if: '$is_undergraduate', then: 1, else: 0 }
                    } }
                } }
            )
            .toArray();

        if(aggregate.length <= 0)
            aggregate.push({ developer: 0, developer_under: 0, designer: 0, designer_under: 0, all: 0, under: 0 });

        cache.count = aggregate.shift();
        cache.lastUpdate = Date.now();
    }

    ctx.body = cache.count;
});

router.get('/all', sparcsRequired, async ctx => {
    ctx.body = cache.all;
});

router.post('/refresh', adminRequired, async ctx => {
    if(!ctx.request.body)
        return ctx.throw(400, 'invalid-body');

    const { ldapId, ldapPw } = ctx.request.body;
    if(typeof ldapId !== 'string' || typeof ldapPw !== 'string')
        return ctx.throw(401, 'ldap-auth-failed');

    const cookieJar = new CookieJar();
    const { data: loginData } = await memvers.post('/login', { un: ldapId, pw: ldapPw }, { jar: cookieJar });
    if(!loginData.success)
        return ctx.throw(401, 'ldap-auth-failed');

    const { data } = await memvers.get('https://memvers-api.sparcs.org/users/all', { jar: cookieJar });
    if(!data.objs || !data.success)
        return ctx.throw(500, 'memvers-failure-public');

    const handleBooleanField = (...fieldNames) => user => {
        for(const fieldName of fieldNames) {
            user[fieldName] = !!user[fieldName];
        }

        return user;
    };

    const users = data.objs.map(
        handleBooleanField('is_private', 'is_developer', 'is_designer', 'is_undergraduate')
    );

    await ctx.db
        .collection('members')
        .drop();

    await ctx.db
        .collection('members')
        .insertMany(users);

    // Invalidate cache
    cache.lastUpdate = 0;

    ctx.body = {
        ok: true,
        users: cache.counts.all.all
    };
});

module.exports = router;

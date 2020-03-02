const adminRequired = require('../middlewares/adminRequired');
const createAsyncRouter = require('@khinenw/express-async-router');
const createError = require('../utils/createError');
const memvers = require('../utils/memvers');
const sparcsRequired = require('../middlewares/sparcsRequired');

const { CookieJar } = require('tough-cookie');

const router = createAsyncRouter();
const cache = { lastUpdate: 0 };
const projection = {
    id: true, name: true, is_developer: true, is_designer: true, is_undergraduate: true,
    github_id: true, linkedin_url: true, behance_url: true, website: true, is_private: true
};

router.get('/', async (req, res) => {
    const users = await req.db
        .collection('members')
        .find({ is_private: false }, { projection })
        .toArray();

    res.json({
        ok: true,
        users
    });
});

router.get('/count', async (req, res) => {
    if(cache.lastUpdate + 24 * 60 * 60 * 1000 < Date.now()) {
        const aggregate = await req.db
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

    res.json({
        ok: true,
        count: cache.count
    });
});

router.get('/all', sparcsRequired, async (req, res) => {
    const users = await req.db
        .collection('members')
        .find({}, { projection })
        .toArray();

    res.json({
        ok: true,
        users
    });
});

router.post('/refresh', adminRequired, async (req, res) => {
    const { ldapId, ldapPw } = req.body;
    if(typeof ldapId !== 'string' || typeof ldapPw !== 'string')
        return createError(401, 'ldap-auth-failed');

    const cookieJar = new CookieJar();
    const { data: loginData } = await memvers.post('/login', { un: ldapId, pw: ldapPw }, { jar: cookieJar });
    if(!loginData.success)
        return createError(401, 'ldap-auth-failed');

    const { data } = await memvers.get('/users/all', { jar: cookieJar, withCredentials: true });
    if(!data.objs || !data.success)
        return createError(500, 'memvers-failure-fetch');

    const handleBooleanField = (...fieldNames) => user => {
        for(const fieldName of fieldNames) {
            user[fieldName] = !!user[fieldName];
        }

        return user;
    };

    const users = data.objs.map(
        handleBooleanField('is_private', 'is_developer', 'is_designer', 'is_undergraduate')
    );

    try {
        await req.db
            .collection('members')
            .drop();
    } catch(err) {}

    await req.db
        .collection('members')
        .insertMany(users);

    // Invalidate cache
    cache.lastUpdate = 0;

    res.json({
        ok: true,
        userCounts: users.length
    });
});

module.exports = router;

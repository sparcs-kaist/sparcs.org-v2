const adminRequired = require('../middlewares/adminRequired');
const createAsyncRouter = require('@khinenw/express-async-router');
const createError = require('../utils/createError');
const memvers = require('../utils/memvers');
const sparcsRequired = require('../middlewares/sparcsRequired');

const { CookieJar } = require('tough-cookie');
const { Members, MemberAttrs } = require('../schema');

const router = createAsyncRouter();
const cache = { lastUpdate: 0 };

router.get('/', async (req, res) => {
    let query = { is_private: false, ignore: { $ne: true } };

    if(req.authState)
        query = { ignore: { $ne: true } };

    const members = await Members.find(query).exec();

    res.json({
        ok: true,
        members
    });
});

router.get('/count', async (req, res) => {
    if(cache.lastUpdate + 24 * 60 * 60 * 1000 < Date.now()) {
        const aggregate = await Members
            .aggregate()
            .group({
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
            })
            .exec();

        if(aggregate.length <= 0)
            aggregate.push({
                developer: 0, developer_under: 0,
                designer: 0, designer_under: 0,
                all: 0, under: 0
            });

        cache.count = aggregate.shift();
        cache.lastUpdate = Date.now();
    }

    res.json({
        ok: true,
        count: cache.count
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

    const ignoredArray = await MemberAttrs.find({ ignore: true }).exec();
    const ignoredMap = new Map(
        ignoredArray.map(attr => [ attr.id, attr.ignore ])
    );

    const users = data.objs.map(user => {
        if(ignoredMap.has(user.id))
            user.ignore = true;

        return user;
    });

    try {
        await Members.collection.drop();
    } catch(err) {}

    await Members.insertMany(users);

    // Invalidate cache
    cache.lastUpdate = 0;

    res.json({
        ok: true,
        memberCounts: users.length
    });
});

router.get('/attribute', adminRequired, async (req, res) => {
    const attributes = await MemberAttrs.find({}).exec();

    res.json({
        ok: true,
        attributes
    });
});

router.post('/attribute', adminRequired, async (req, res) => {
    const { userId, admin, ignore } = req.body;

    if(typeof userId !== 'string')
        return createError(422, 'invalid-userid');

    const member = await Members.findOne({ id: userId });
    if(!member)
        return createError(404, 'no-such-member');

    await MemberAttrs
        .findOneAndUpdate(
            { id: userId },
            {
                id: userId,
                admin: !!admin,
                ignore: !!ignore
            },
            { upsert: true }
        );

    member.ignore = ignore;
    await member.save();

    res.json({
        ok: true
    });
});

router.delete('/attribute/:userId', adminRequired, async (req, res) => {
    const { userId } = req.params;

    const attr = await MemberAttrs.findOne({ id: userId });
    if(!attr)
        return createError(404, 'no-such-attribute');

    await MemberAttrs.deleteOne({ id: userId });
    await Members.findOneAndUpdate(
        { id: userId },
        { $set: { ignore: null } }
    );

    res.json({
        ok: true
    });
});

module.exports = router;

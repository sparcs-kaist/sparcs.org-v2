const adminRequired = require('../middlewares/adminRequired');
const axios = require('axios');
const config = require('../../config.json');
const sparcsRequired = require('../middlewares/sparcsRequired');
const Router = require('@koa/router');

const memvers = axios.create({
    baseURL: config.memversUrl,
    validateStatus: false
});

const router = new Router();
const cache = {};

const updateCache = users => {
    cache.all = users;
    cache.public = users.filter(user => !user.is_private);

    const countMember = fn => {
        return users.reduce((accumulator, member) => {
            if(fn(member))
                return ++accumulator;

            return accumulator;
        }, 0);
    };

    const count = {};
    count.all = {
        all: countMember(() => true),
        undergraduate: countMember(member => member.is_undergraduate)
    };

    count.designers = {
        all: countMember(member => member.is_designer),
        undergraduate: countMember(member => member.is_designer && member.is_undergraduate)
    };

    count.developers = {
        all: countMember(member => member.is_developer),
        undergraduate: countMember(member => member.is_developer && member.is_undergraduate)
    };

    cache.count = count;
};

router.get('/', async ctx => {
    ctx.body = cache.public;
});

router.get('/count', async ctx => {
    ctx.body = cache.count;
});

router.get('/all', sparcsRequired, async ctx => {
    ctx.body = cache.all;
});

router.post('/refresh', adminRequired, async ctx => {
    if(!ctx.request.body.ldapId || !ctx.request.body.ldapPw)
        return ctx.throw(401, 'ldap-needed');

    const { data } = await memvers.get('https://memvers-api.sparcs.org/users/all');
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
        .collection('home-members')
        .drop();

    await ctx.db
        .collection('home-members')
        .insertMany(users);

    updateCache(users);

    ctx.body = {
        ok: true,
        users: cache.counts.all.all
    };
});

module.exports = async database => {
    const users = await database
        .collection('home-members')
        .find({})
        .toArray();

    updateCache(users);
    
    return router;
};

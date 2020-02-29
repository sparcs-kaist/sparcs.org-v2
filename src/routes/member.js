const axios = require('axios');
const sparcsRequired = require('../middlewares/sparcsRequired');
const Router = require('@koa/router');

const authedAxios = axios.create({});
const router = new Router();
const cache = {};

const updateCache = async () => {
    if(
        (cache.date) && ((Date.now() - cache.date) < 1000 * 3600 * 24)
    ) {
        return;
    }

    cache.date = Date.now();

    try {
        const { data } = await axios.get('https://memvers-api.sparcs.org/users/public');
        if(!data.objs || !data.success)
            throw new Error("Fetch failed");

        cache.public = data.objs;
    } catch(err) {}

    try {
        // TODO authenticate
        const { data } = await authedAxios.get('https://memvers-api.sparcs.org/users/all');
        if(!data.objs || !data.success)
            throw new Error("Fetch failed");

        cache.all = data.objs;
    } catch(err) {}

    const countMember = fn => {
        return cache.all.reduce((accumulator, member) => {
            if(fn(member))
                return ++accumulator;

            return accumulator;
        }, 0);
    };

    cache.designers = {
        all: countMember(member => member.is_designer),
        undergraduate: countMember(member => member.is_designer && member.is_undergraduate)
    };

    cache.developers = {
        all: countMember(member => member.is_developer),
        undergraduate: countMember(member => member.is_developer && member.is_undergraduate)
    };
};

router.get('/', async ctx => {
    await updateCache();
    ctx.body = cache.public;
});

router.get('/count', async ctx => {
    await updateCache();
    const { designers, developers } = cache;
    ctx.body = { designers, developers };
});

router.get('/all', sparcsRequired, async ctx => {
    await updateCache();
    ctx.body = cache.all;
});

module.exports = router;

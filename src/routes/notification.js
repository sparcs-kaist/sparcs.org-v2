const Router = require('@koa/router');
const router = new Router();

router.get('/', async ctx => {
    const notifications = await ctx.db
        .collection('notifications')
        .find({}, { projection: { _id: false } })
        .toArray();

    ctx.body = notifications;
});

router.post('/', async ctx => {

});

router.delete('/:id', async ctx => {

});

module.exports = router;

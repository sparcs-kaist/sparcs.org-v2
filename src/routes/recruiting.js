const adminRequired = require('../middlewares/adminRequired');
const Router = require('@koa/router');

const router = new Router();
router.get('/available', async ctx => {

});

router.post('/available', adminRequired, async ctx => {

});

module.exports = router;

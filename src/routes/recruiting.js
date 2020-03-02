const adminRequired = require('../middlewares/adminRequired');
const createAsyncRouter = require('@khinenw/express-async-router');

const router = createAsyncRouter();
router.get('/available', async (req, res) => {
    const recruitingInfo = await req.db
        .collection('options')
        .findOne({ key: 'recruiting-info' });

    const isAvailable = recruitingInfo ? recruitingInfo.value : false;

    res.json({
        ok: true,
        available: isAvailable
    });
});

router.post('/available', adminRequired, async ctx => {
    const available = !!req.body.available;

    await req.db
        .collection('options')
        .findOneAndUpdate(
            { key: 'recruiting-info' },
            {
                key: 'recruiting-info',
                value:
            },
            { upsert: true }
        );

    res.json({
        ok: true,
        available
    });
});

module.exports = router;

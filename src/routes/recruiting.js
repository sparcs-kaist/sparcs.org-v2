const adminRequired = require('../middlewares/adminRequired');
const createAsyncRouter = require('@khinenw/express-async-router');

const { Options } = require('../schema');

const router = createAsyncRouter();
router.get('/available', async (req, res) => {
    const recruitingInfo = await Options.findOne({ key: 'recruiting-info' });

    const isAvailable = recruitingInfo ? recruitingInfo.value : false;

    res.json({
        ok: true,
        available: isAvailable === 'true'
    });
});

router.post('/available', adminRequired, async (req, res) => {
    const available = !!req.body.available;

    await Options
        .findOneAndUpdate(
            { key: 'recruiting-info' },
            {
                key: 'recruiting-info',
                value: available.toString()
            },
            { upsert: true }
        );

    res.json({
        ok: true,
        available
    });
});

module.exports = router;

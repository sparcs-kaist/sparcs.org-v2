const adminRequired = require('../middlewares/adminRequired');
const createAsyncRouter = require('@khinenw/express-async-router');
const createError = require('../utils/createError');
const router = createAsyncRouter();

const { Notifications } = require('../schema');

router.get('/', async (req, res) => {
    const notifications = await Notifications.find({}).exec();
    res.json({
        ok: true,
        notifications
    });
});

router.post('/', adminRequired, async (req, res) => {
    const { title, raw, content, level } = req.body;

    if(typeof title !== 'string' || title.length <= 0)
        return createError(422, 'no-title');

    if(typeof content !== 'string' || content.length <= 0)
        return createError(422, 'no-content');

    const notification = { title, content };
    notification.raw = !!raw;

    const levelParsed = parseInt(level);
    if(isFinite(levelParsed) && (0 <= levelParsed && levelParsed <= 3)) {
        notification.level = levelParsed;
    } else {
        notification.level = 0;
    }

    const tuple = new Notifications(notification);
    await tuple.save();

    res.json({
        ok: true
    });
});

router.delete('/:id([a-z0-9]{24})', adminRequired, async (req, res) => {
    await Notifications
        .deleteOne({
            _id: req.params.id
        });

    res.json({
        ok: true
    });
});

module.exports = router;

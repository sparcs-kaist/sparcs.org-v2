const adminRequired = require('../middlewares/adminRequired');
const config = require('../../config.json');
const createAsyncRouter = require('@khinenw/express-async-router');
const createError = require('../utils/createError');
const sparcsRequired = require('../middlewares/sparcsRequired');
const { upload } = require('../middlewares/upload');

const { Seminars } = require('../schema');

const router = createAsyncRouter();
router.get('/', async (req, res) => {
    const seminars = await Seminars
        .find({})
        .sort({ date: -1 })
        .exec();

    res.json({
        ok: true,
        seminars
    });
});

router.post('/', sparcsRequired, upload.array('content', 16), async (req, res) => {
    const { title, speaker, date } = req.body;
    const seminar = {};

    if(typeof title !== 'string' || title.length <= 0) {
        seminar.title = 'Untitled Seminar';
    } else {
        seminar.title = title;
    }

    if(typeof speaker !== 'string' || speaker.length < 0) {
        seminar.speaker = 'Anonymous';
    } else {
        seminar.speaker = speaker;
    }

    if(typeof date !== 'number') {
        seminar.date = new Date();
    } else {
        seminar.date = new Date(date);
    }

    const sources = req.files.map(({ location }) => location);
    seminar.sources = sources;

    const tuple = new Seminars(seminar);
    await tuple.save();
});

router.delete('/:id([a-z0-9]{24})', adminRequired, async (req, res) => {

});

module.exports = router;

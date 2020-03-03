const aws = require('aws-sdk');
const config = require('../../config.json');
const createAsyncRouter = require('@khinenw/express-async-router');
const sparcsRequired = require('../middlewares/sparcsRequired');
const upload = require('../middlewares/upload');

const { Seminar } = require('../schema');

const router = createAsyncRouter();
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
        seminar.date = Date.now();
    } else {
        seminar.date = date;
    }

    const sources = req.files.map(({ location }) => location);
    seminar.sources = sources;

    const tuple = new Seminars(seminar);
    await tuple.save();
});

module.exports = router;

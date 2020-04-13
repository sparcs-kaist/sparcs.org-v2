const adminRequired = require('../middlewares/adminRequired');
const config = require('../../config.json');
const createAsyncRouter = require('@khinenw/express-async-router');
const createError = require('../utils/createError');
const sparcsRequired = require('../middlewares/sparcsRequired');
const { s3, upload } = require('../middlewares/upload');

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
    const { title, speaker, date, links } = req.body;
    const seminar = {};

    if(typeof title !== 'string' || title.length <= 0) {
        seminar.title = 'Untitled Seminar';
    } else {
        seminar.title = title;
    }

    if(typeof speaker !== 'string' || speaker.length <= 0) {
        seminar.speaker = 'Anonymous';
    } else {
        seminar.speaker = speaker;
    }

    const dateParsed = typeof date === 'string' ? parseInt(date) : date;
    if(typeof dateParsed !== 'number' || !isFinite(dateParsed)) {
        seminar.date = new Date();
    } else {
        seminar.date = new Date(dateParsed);
    }

    const sources = req.files.map(({ key, location }) => ({
        sourceType: 'S3',
        name: key,
        url: location
    }));

    if(typeof links === 'string') {
        try {
            const linksParsed = JSON.parse(links);
            if(typeof linksParsed === 'object') {
                Object.keys(linksParsed).forEach(key => {
                    sources.push({
                        sourceType: 'Link',
                        name: key,
                        url: linksParsed[key]
                    });
                });
            }
        } catch(e) {}
    }

    seminar.sources = sources;

    const tuple = new Seminars(seminar);
    await tuple.save();

    res.json({
        ok: true
    });
});

router.delete('/:id([a-z0-9]{24})', adminRequired, async (req, res) => {
    const result = await Seminars.findOne(
        { _id: req.params.id }
    );

    if(!result)
        return createError(404, "not-found");

    const { sources } = result;
    const objects = sources
        .filter(source => source.type === 'S3')
        .map(source => ({
            Key: source.name
        }));

    if(objects.length > 0) {
        await new Promise((resolve, reject) => {
            s3.deleteObjects({
                Bucket: config.awsS3BucketName,
                Delete: {
                    Objects: objects
                }
            }, (err, data) => {
                if(err)
                    return reject(err);

                resolve(data);
            });
        });
    }

    await Seminars.deleteOne(
        { _id: req.params.id }
    );

    res.json({
        ok: true
    });
});

module.exports = router;

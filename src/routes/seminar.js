const adminRequired = require('../middlewares/adminRequired');
const config = require('../../config.json');
const createAsyncRouter = require('@khinenw/express-async-router');
const createError = require('../utils/createError');
const sparcsRequired = require('../middlewares/sparcsRequired');
const { s3, upload } = require('../middlewares/upload');

const { Seminars } = require('../schema');

const hasEditPermission = (user, seminar) => {
    return user && (user?.admin || seminar.uploaderId === user?.id);
}

const router = createAsyncRouter();
router.get('/', async (req, res) => {
    const seminars = await Seminars
        .find({})
        .sort({ date: -1 })
        .exec();

    res.json({
        ok: true,
        seminars: seminars.map(item => ({
            _id: item._id,
            date: item.date,
            speaker: item.speaker,
            sources: item.sources,
            title: item.title,
            uploaderId: item.uploaderId,
            canEdit: hasEditPermission(req.sparcsUser, item)
        }))
    });
});

router.post('/', sparcsRequired, upload.array('content', 16), async (req, res) => {
    const { title, speaker, date, links } = req.body;
    const seminar = {};

    seminar.uploaderId = req.sparcsUser.id;

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

router.put('/:id([a-z0-9]{24})', sparcsRequired, async (req, res) => {
    const result = await Seminars.findOne(
        { _id: req.params.id }
    );

    if(!result)
        return createError(404, "not-found");

    if(!hasEditPermission(req.sparcsUser, result)) {
        return createError(403, "unauthorized");
    }

    const { title, speaker, date } = req.body;
    const updatePayload = {};

    if(typeof title !== 'string' || title.length <= 0) {
        updatePayload.title = 'Untitled Seminar';
    } else {
        updatePayload.title = title;
    }

    if(typeof speaker !== 'string' || speaker.length <= 0) {
        updatePayload.speaker = 'Anonymous';
    } else {
        updatePayload.speaker = speaker;
    }

    const dateParsed = typeof date === 'string' ? parseInt(date) : date;
    if(typeof dateParsed !== 'number' || !isFinite(dateParsed)) {
        updatePayload.date = new Date();
    } else {
        updatePayload.date = new Date(dateParsed);
    }

    await Seminars.updateOne({ _id: req.params.id }, updatePayload);
    
    res.json({
        ok: true
    });
});

router.delete('/:id([a-z0-9]{24})', sparcsRequired, async (req, res) => {
    const result = await Seminars.findOne(
        { _id: req.params.id }
    );

    if(!result)
        return createError(404, "not-found");

    if(!hasEditPermission(req.sparcsUser, result)) {
        return createError(403, "unauthorized");
    }

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

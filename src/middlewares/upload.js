const aws = require('aws-sdk');
const config = require('../../config.json');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
    accessKeyId: config.awsS3AccessKey,
    secretAccessKey: config.awsS3SecretKey,
});

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'sparcs.home',
        // Set public read permissions
        acl: 'public-read',
        // Auto detect contet type
        contentType: multerS3.AUTO_CONTENT_TYPE,
        cacheControl: 'max-age=31536000',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            const extension = path.extname(file.originalname);
            const { speaker } = req.body;
            const fileName = `${speaker}_${Date.now()}.${extension}`;
            cb(null, fileName);
        },
    })
});

module.exports = {
    upload,
    s3
};

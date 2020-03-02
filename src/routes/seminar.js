const aws = require('aws-sdk');
const config = require('../../config.json');
const multer = require('@koa/multer');
const sparcsRequired = require('../middlewares/sparcsRequired');

const Router = require('@koa/router');

const router = new Router();
router.post('/upload', sparcsRequired, async ctx => {

});

module.exports = router;

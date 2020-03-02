const auth = require('./middlewares/auth');
const bodyParser = require('body-parser');
const config = require('../config.json');
const cookieParser = require('cookie-parser');
const createAsyncRouter = require('@khinenw/express-async-router');
const database = require('./utils/database');
const express = require('express');
const path = require('path');
const routeAlbum = require('./routes/album');
const routeMember = require('./routes/member');
const routeNotification = require('./routes/notification');
const routeRecruiting = require('./routes/recruiting');
const routeSeminar = require('./routes/seminar');

const env = (process.env.NODE_ENV || 'development');
const maxAge = env === 'development' ? 0 : 1000 * 60 * 60 * 6;
const port = parseInt(process.env.PORT) || '3000';
const rootPath = path.resolve(__dirname, '..');

const apiRouter = createAsyncRouter();
apiRouter.use(auth);
apiRouter.use('/album',         routeAlbum);
apiRouter.use('/member',        routeMember);
apiRouter.use('/notification',  routeNotification);
apiRouter.use('/seminar',       routeSeminar);
apiRouter.use((req, res) => {
    res.status(404).json({
        ok: false,
        reason: 'not-found'
    });
});
apiRouter.use((err, req, res, next) => {
    if(res.headersSent)
        return next(err);

    if(err.status) {
        res.status(err.status);
        res.json({
            ok: false,
            reason: err.message
        });
        return;
    }

    res.status(500).json({
        ok: false,
        reason: 'internal-error'
    });

    console.error(err);
});

const app = express();
app.set('port', port);
app.set('trust proxy', 'loopback');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(database.middleware());
app.use('/api', apiRouter);
app.use('/assets', express.static(path.join(rootPath, 'assets')));
app.use('/dist', express.static(path.join(rootPath, 'dist')));
app.use((req, res) => {
    res.sendFile(path.join(rootPath, 'dist', 'index.html'));
});
app.use((err, req, res, next) => {
    if(res.headersSent)
        return next(err);

    res.status(500).send('Internal Server Error');
});

(async () => {
    await database.init();
    app.listen(app.get('port'));

    console.log(`Listening on port ${port}...`);
})();

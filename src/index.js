const config = require('../config.json');
const bodyParser = require('koa-bodyparser');
const database = require('./utils/database');
const send = require('koa-send');
const serve = require('koa-static');
const mount = require('koa-mount');
const path = require('path');
const routeAlbum = require('./routes/album');
const routeMember = require('./routes/member');
const routeNotification = require('./routes/notification');
const routeRecruiting = require('./routes/recruiting');
const routeSeminar = require('./routes/seminar');

const Koa = require('koa');
const Router = require('@koa/router');

const env = (process.env.NODE_ENV || 'development');
const maxAge = env === 'development' ? 0 : 1000 * 60 * 60 * 6;
const port = parseInt(process.env.PORT) || '3000';
const rootPath = path.resolve(__dirname, '..');

const apiRouter = new Router();
apiRouter.use('/album',        routeAlbum.routes(),        routeAlbum.allowedMethods());
apiRouter.use('/member',       routeMember.routes(),       routeMember.allowedMethods());
apiRouter.use('/notification', routeNotification.routes(), routeNotification.allowedMethods());
apiRouter.use('/recruiting',   routeRecruiting.routes(),   routeRecruiting.allowedMethods());
apiRouter.use('/seminar',      routeSeminar.routes(),      routeRecruiting.allowedMethods());
apiRouter.all('*', async ctx => {
    ctx.status = 404;
    ctx.body = {
        ok: false,
        reason: 'not-found'
    };
});

const app = new Koa();
app.use(bodyParser());
app.use(database.middleware());
app.use(mount('/api',    apiRouter.routes(), apiRouter.allowedMethods()));
app.use(mount('/assets', serve(path.join(rootPath, 'assets'), { maxage: maxAge })));
app.use(mount('/dist',   serve(path.join(rootPath, 'dist'),   { maxage: maxAge })));
app.use(async ctx => {
    ctx.response.type = 'text/html';
    await send(ctx, 'index.html', { root: path.join(rootPath, 'dist'), maxage: maxAge });
});

app.on('error', (err, ctx) => {
    console.error(err);
    //TODO
});

(async () => {
    await database.init();
    app.listen(port);

    console.log(`Listening on port ${port}...`);
})();

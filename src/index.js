const config = require('../config.json');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const path = require('path');
const routeAlbum = require('./routes/album');
const routeMember = require('./routes/member');
const routeNotification = require('./routes/notification');
const routeRecruiting = require('./routes/recruiting');
const routeSeminar = require('./routes/seminar');

const Koa = require('koa');

const env = (process.env.NODE_ENV || 'development');
const maxAge = env === 'development' ? 0 : 1000 * 60 * 60 * 6;
const port = parseInt(process.env.PORT) || '3000';
const rootPath = path.resolve(__dirname, '..');

const app = new Koa();
app.use(bodyParser());
app.use('/api/album', routeAlbum);
app.use('/api/member', routeMember);
app.use('/api/notification', routeNotification);
app.use('/api/recruiting', routeRecruiting);
app.use('/api/seminar', routeSeminar);
app.use('/assets', serve(path.join(rootPath, 'assets'), { maxage: maxAge }));
app.use('/dist', serve(path.join(rootPath, 'dist'), { maxage: maxAge }));
app.use(ctx => {
    ctx.response.type = 'text/html';
    return send(ctx, path.join(rootPath, 'dist', 'index.html'));
});

app.listen(port);

console.log(`Listening on port ${port}...`);

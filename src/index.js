const bodyParser = require('koa-bodyparser');
const Koa = require('koa');

const app = new Koa();
app.use(bodyParser);

/* const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('../config.json');
const express = require('express');
const path = require('path');

const rootPath = path.resolve(__dirname, '..');
const port = parseInt(process.env.PORT) || '3000';

const app = express();
app.set('port', port);
app.set('trust proxy', 'loopback');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.get('/api/album', routeAlbum);
app.get('/api/member', routeMember);
app.get('/api/notification', routeNotification);
app.get('/api/seminar', routeSeminar);
app.use('/assets', express.static(path.join(rootPath, 'assets')));
app.use('/dist', express.static(path.join(rootPath, 'dist'));
app.use((req, res) => {
    res.sendFile(path.join(rootPath, 'dist', 'index.html'));
}); */

app.listen(app.get('port'));

console.log(`Listening on port ${port}...`);

const config = require('../../config.json');
const createAsyncRouter = require('@khinenw/express-async-router');
const createError = require('../utils/createError');
const encryptedCookie = require('../utils/encryptedCookie');
const jwt = require('../utils/jwt');
const pairToken = require('../utils/pairToken');
const sparcsRequired = require('../middlewares/sparcsRequired');

const { MemberAttrs } = require('../schema');
const SSOClient = require('../utils/SSOClient');

const isDevMode = (process.env.NODE_ENV || 'development').trim() === 'development';
const ssoClient = new SSOClient(config.ssoClient, config.ssoSecret);
const router = createAsyncRouter();


router.get('/', sparcsRequired, (req, res) => {
    res.json({
        ok: true,
        id: req.sparcsUser.id,
        name: req.sparcsUser.name,
        admin: req.sparcsUser.admin
    });
});

router.use('/', (req, res, next) => {
    if(!isDevMode && req.protocol !== 'https') {
        res.redirect(`https://${req.hostname}${req.url}`);
        return;
    }

    next();
});

router.post('/', async (req, res) => {
    const { url, state } = ssoClient.getLoginParams();

    // Session Hijacking can't be protected by using this method. (MITM can hijack the cookie)
    // But it is same when you're using the session. (MITM can hijack the sess id)
    const cookie = await encryptedCookie.create({ state });
    res.cookie(
        'PHPSESSID',
        cookie,
        {
            httpOnly: true,
            secure: !isDevMode
        }
    );

    res.json({
        ok: true,
        url
    });
});

router.post('/finalize', async (req, res) => {
    if(typeof req.cookies.PHPSESSID !== 'string')
        return createError(400, 'authentication-not-started');

    let cookie;
    try {
        cookie = await encryptedCookie.parse(req.cookies.PHPSESSID);
    } catch(err) {
        return createError(400, 'authentication-not-started');
    }

    const state = cookie.state;
    const { state: newState, code } = req.body;
    if(typeof newState !== 'string' || newState !== state)
        return createError(403, 'invalid-state');

    if(typeof code !== 'string')
        return createError(403, 'invalid-code');

    let userData;
    try {
        userData = await ssoClient.getUserInfo(code);
    } catch(err) {
        return createError(400, 'cannot-get-user-info');
    }

    const id = userData.sparcs_id;
    if(!id)
        return createError(403, 'not-sparcs');

    const attributes = await MemberAttrs.findOne({
        id
    });
    const isAdmin = (!!attributes && attributes.admin === true);

    const name = userData.last_name + userData.first_name;
    const { message, signature, publicKey } = await pairToken.create();
    const token = await jwt.generate({ id, name, admin: isAdmin, message, signature });

    res.cookie('tokenVerification', publicKey.toString('base64'), {
        httpOnly: true,
        secure: !isDevMode,
        maxAge: config.tokenExpiresIn * 1000
    });

    res.json({
        ok: true,
        id,
        name,
        admin: isAdmin,
        token
    });
});

router.post('/unregister', async (req, res) => {
    res.json({ success: true });
});

module.exports = router;

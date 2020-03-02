const createAsyncRouter = require('@khinenw/express-async-router');
const createError = require('../utils/createError');
const jwt = require('../utils/jwt');
const memvers = require('../utils/memvers');
const sparcsRequired = require('../middleware/sparcsRequired');

const { CookieJar } = require('tough-cookie');

const router = createAsyncRouter();

router.get('/', sparcsRequired, (req, res) => {
    const token = req.authState;
});

router.post('/', async (req, res) => {
    const { ldapId, ldapPw } = req.body;
    if(typeof ldapId !== 'string' || typeof ldapPw !== 'string')
        return createError(401, 'ldap-auth-failed');

    const cookieJar = new CookieJar();
    const { data: loginData } = await memvers.post('/login', { un: ldapId, pw: ldapPw }, { jar: cookieJar });
    if(!loginData.success)
        return createError(401, 'ldap-auth-failed');

    const { data: nuguData } = await memvers.get('/nugu', cookieJar);
    if(!nuguData.success || !nuguData.obj)
        return createError(500, 'nugu-fetch-failed');

    const { obj: { id, name } } = nuguData;
    const token = await jwt.generate({ id, name });

    res.json({
        ok: true,
        id,
        name,
        token
    });
});

module.exports = router;

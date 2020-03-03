const jwt = require('../utils/jwt');
const pairToken = require('../utils/pairToken');

module.exports = async (req, res, next) => {
    const token = req.get('Sparcs-Authorization');
    if(!token)
        return next();

    const { validated, payload } = await jwt.validate(token);
    if(!validated)
        return next();

    try {
        const message = Buffer.from(payload.message, 'base64');
        const signature = Buffer.from(payload.signature, 'base64');
        const publicKey = Buffer.from(req.cookies.tokenVerification, 'base64');

        await pairToken.validate(message, signature, publicKey);
    } catch(e) {
        return next();
    }

    req.authState = true;
    req.sparcsUser = payload;
    next();
};

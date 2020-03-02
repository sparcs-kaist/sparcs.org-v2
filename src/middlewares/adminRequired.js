const createError = require('../utils/createError');

module.exports = async (req, res, next) => {
    if(!req.authState)
        return createError(401, 'unauthorized');

    if(req.sparcsUser.id !== 'wheel')
        return createError(403, 'wheel-permission-needed');

    next();
};

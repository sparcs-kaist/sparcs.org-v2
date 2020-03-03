const createError = require('../utils/createError');

module.exports = async (req, res, next) => {
    if(!req.authState)
        return createError(401, 'unauthorized');

    if(!req.sparcsUser.admin)
        return createError(403, 'admin-permission-needed');

    next();
};

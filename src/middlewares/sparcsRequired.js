const createError = require('../utils/createError');

module.exports = async (req, res, next) => {
    if(!req.authState)
        return createError(401, 'unauthorized');

    next();
};

module.exports = async (req, res, next) => {
    const token = req.get('Sparcs-Authorization');
    if(!token)
        return next();

    const { validated, payload } = await jwt.validate(token);
    if(!validated)
        return next();

    req.authState = true;
    req.sparcsUser = payload;
    next();
};

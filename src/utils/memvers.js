const axios = require('axios');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const config = require('../../config.json');

const memvers = axios.create({
    baseURL: config.memversUrl,
    validateStatus: false
});

axiosCookieJarSupport(memvers);

module.exports = memvers;

const config = require('../../config.json');
const fs = require('fs');
const jwt = require('jsonwebtoken');

if(!['RS256', 'HS256'].includes(config.jwtMode)) {
    console.error("Unknown JWT Mode!");
    config.jwtMode = 'RS256';
}

const secret = config.jwtMode === 'RS256' ?
    fs.readFileSync(config.privateKey) :
    config.secret;

module.exports = {
    generate(payload) {
        return new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                secret,
                { algorithm: config.jwtMode, expiresIn: config.tokenExpiresIn },
                (err, token) => {
                    if(err) return reject(err);
                    resolve(token);
                }
            );
        });
    },

    validate(token) {
        return new Promise(resolve => {
            jwt.verify(
                token,
                secret,
                { algorithms: [config.jwtMode] },
                (err, payload) => {
                    if(err) {
                        return resolve({
                            validated: false,
                            payload: null
                        });
                    }

                    resolve({
                        validated: true,
                        payload
                    });
                }
            );
        });
    }
};

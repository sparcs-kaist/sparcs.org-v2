const config = require('../../config.json');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const secret = fs.readFileSync(config.privateKey);

module.exports = {
    generate(payload) {
        return new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                secret,
                { algorithm: 'RS256', expiresIn: '1h' },
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
                { algorithms: ['RS256'] },
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

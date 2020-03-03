const crypto = require('crypto');
const eccrypto = require('eccrypto');

module.exports = {
    async create() {
        const random = await new Promise((resolve, reject) => {
            crypto.randomBytes(32, (err, randomBytes) => {
                if(err)
                    return reject(err);

                resolve(randomBytes);
            });
        });

        const privateKey = eccrypto.generatePrivate();
        const publicKey = eccrypto.getPublic(privateKey);

        const signature = await eccrypto.sign(privateKey, random);

        return {
            message: random.toString('base64'),
            signature: signature.toString('base64'),
            publicKey: publicKey.toString('base64')
        };
    },

    async validate(message, signature, publicKey) {
        await eccrypto.verify(publicKey, message, signature);
    }
};

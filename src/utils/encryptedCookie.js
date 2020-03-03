const config = require('../../config.json');
const crypto = require('crypto');

const key = crypto.createHash('sha256').update(config.secret).digest();

module.exports = {
    async create(cookieObj) {
        const iv = await new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if(err)
                    return reject(err);

                resolve(buf);
            });
        });

        const unencryptedCookie = JSON.stringify({
            content: cookieObj,
            exp: Date.now() + 10 * 60 * 1000
        });

        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        const cookie = cipher.update(unencryptedCookie, 'utf8', 'base64') + cipher.final('base64');

        return  iv.toString('base64') + '#' + cookie;
    },

    async parse(encryptedCookie) {
        const split = encryptedCookie.split('#');
        if(split.length < 2)
            throw new Error("Invalid Cookie");

        let cookie;
        try {
            const [ ivText, encryptedCookie ] = split;
            const iv = Buffer.from(ivText, 'base64');

            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            const cookieDecrypted = decipher.update(encryptedCookie, 'base64', 'utf8') + decipher.final('utf8');

            cookie = JSON.parse(cookieDecrypted);
        } catch(err) {
            throw new Error("Invalid Cookie");
        }

        if(cookie.exp < Date.now())
            throw new Error("Expired Cookie");

        return cookie.content;
    }
};

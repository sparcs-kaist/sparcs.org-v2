const config = require('../../config.json');
const { MongoClient } = require('mongodb');

module.exports = {
    database: null,

    async init() {
        const client = await MongoClient.connect(
            config.mongoUrl,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );

        this.database = client.db(config.mongoDBName);
    },

    middleware() {
        return async (ctx, next) => {
            ctx.db = this.database;
            await next();
        };
    }
};

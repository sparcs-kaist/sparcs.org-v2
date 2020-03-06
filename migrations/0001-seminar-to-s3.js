/*
* 0001-seminar-to-s3
* Replaces "sparcs.org/static/seminars" to "s3.ap-northeast-2.amazonaws.com/sparcs.home/seminars"
* Replaces "sparcs.org/dist/static/seminars" to "s3.ap-northeast-2.amazonaws.com/sparcs.home/seminars"
* 2020.03.07
*/

const config = require('../config.json');
const { MongoClient } = require('mongodb');

(async () => {
    const db = (await MongoClient.connect(config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }))
        .db(config.mongoUrl.split('/').pop());

    await db.collection('seminars')
        .updateMany (
            {
                sources: {
                    $regex: "/sparcs\\.org\\/static\\/seminars/"
                }
            },

            [ { $set: {
                sources: {
                    $map: {
                        'input': '$sources',
                        'as': 'source',
                        'in': {
                            $concat: [
                                { $arrayElemAt: [ { $split: [ "$$source", "sparcs.org/static/seminars" ] }, 0 ] },
                                "s3.ap-northeast-2.amazonaws.com/sparcs.home/seminars",
                                { $arrayElemAt: [ { $split: [ "$$source", "sparcs.org/static/seminars" ] }, 1 ] }
                            ]
                        }
                    }
                }
            } } ]
        );

    await db.collection('seminars')
        .updateMany (
            {
                sources: {
                    $regex: "/sparcs\\.org\\/dist\\/static\\/seminars/"
                }
            },

            [ { $set: {
                sources: {
                    $map: {
                        'input': '$sources',
                        'as': 'source',
                        'in': {
                            $concat: [
                                { $arrayElemAt: [ { $split: [ "$$source", "sparcs.org/dist/static/seminars" ] }, 0 ] },
                                "s3.ap-northeast-2.amazonaws.com/sparcs.home/seminars",
                                { $arrayElemAt: [ { $split: [ "$$source", "sparcs.org/dist/static/seminars" ] }, 1 ] }
                            ]
                        }
                    }
                }
            } } ]
        );

    console.log("Done :D");
})();

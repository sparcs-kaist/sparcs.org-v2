/*
* 0002-seminar-remove-prefix
* Remove incorrectly entered seminar source prefixes.
* ex) "https://s3.ap-northeast-2.amazonaws.com/sparcs.home/seminars/http://zeakd.github.io/seminar-js-1/index.html" to
      "http://zeakd.github.io/seminar-js-1/index.html"

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
                    $regex: 'https:\\/\\/s3.ap-northeast-2.amazonaws.com\\/sparcs.home\\/seminars\\/.*\\/.*'
                }
            },

            [ { $set: {
                sources: {
                    $map: {
                        'input': '$sources',
                        'as': 'source',
                        'in': {
                            $concat: [
                                { $arrayElemAt: [ { $split: [
                                    "$$source", "https://s3.ap-northeast-2.amazonaws.com/sparcs.home/seminars/"
                                ] }, 1 ] }
                            ]
                        }
                    }
                }
            } } ]
        );

    console.log("Done :D");
})();

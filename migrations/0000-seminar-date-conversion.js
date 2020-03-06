/*
* 0000-seminar-date-conversion
* Converts "YYYY-MM-dd" into Date Object
* 2020.03.07
*/

const config = require('../config.json');
const { MongoClient } = require('mongodb');

(async () => {
    const db = (await MongoClient.connect(config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }))
        .db(config.mongoUrl.split('/').pop());

    await db.collection('seminars')
        .updateMany (
            { date: { $type: 'string' } },
            [ { $project: {
                _id: true,
                title: true,
                speaker: true,
                date: {
                    $dateFromString: { dateString: '$date', format: "%Y-%m-%d" }
                },
                sources: true
            } } ]
        );

    console.log("Done :D");
})();

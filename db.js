const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const fs = require('fs');

module.exports = MongoClient.connect(url, function(err, db) {
    // const collection = db.collection('nonlexWords')
    //get nonlexical words from a txt file
    if (err) throw err;
    const dbo = db.db("nonlexDB");
    console.log("db", db);

    require.extensions['.txt'] = function (module, filename) {
        module.exports = fs.readFileSync(filename, 'utf8');
    };
    const nonlexStr = require("./nonlex.txt");
    let nonlex = nonlexStr.split("\n").map(el => el.slice(0,-1));
    dbo.collection("nonlexWords").insertOne({nonlex: nonlex}, (err, result) => {
        if (err) throw err;
        console.log(result);
    })
});

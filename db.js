const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/lingDB';
const fs = require('fs');

exports.connect = function() {
    return new Promise(function(resolve, reject) {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            //if collection doesn't exist create one and add data
            const dbo = db.db("lingDB")

            dbo.listCollections({
                name: "nonlexWords"
            }).toArray((err, items) => {
                // console.log(items.length, items);
                let data;
                if (items.length == 0) {
                    require.extensions['.txt'] = function(module, filename) {
                        module.exports = fs.readFileSync(filename, 'utf8');
                    };
                    const nonlexStr = require("./nonlex.txt");
                    let nonlex = nonlexStr.split("\n").map(el => el.slice(0, -1));
                    nonlex.pop(); //removing an empty index from txt file
                    console.log(nonlex);
                    dbo.collection("nonlexWords").insertOne({
                        nonlex: nonlex
                    }, (err, result) => {
                        if (err) throw err;
                        resolve(db.db("lingDB"));
                    })
                }
                resolve(db.db("lingDB"));
            })
        });
    });
}

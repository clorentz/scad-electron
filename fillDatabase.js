var MongoClient = require('mongodb').MongoClient;
const asym_crypto = require('quick-encrypt');

var dbUrl = "mongodb://localhost:27017/";

MongoClient.connect(dbUrl, function(err, db) {
    if (err) throw err;
    var dbo = db.db("scad");
    keys2 = asym_crypto.generate(2048);
    keys3 = asym_crypto.generate(2048);
    u2 = {"login": "u2", "pubKey": keys2.public};
    u3 = {"login": "u3", "pubKey": keys3.public};

    dbo.collection("usersCollection").insertOne(u2);
    dbo.collection("usersCollection").insertOne(u3);
    db.close();
}); 
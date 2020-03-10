var express = require("express");
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var uri = "mongodb+srv://karla001:sank@cluster-motoapp-2sfbw.mongodb.net";

MongoClient.connect(uri,  { useUnifiedTopology: true } , function(err, client){
var collection = client.db('db_motoapp').collection('drivers'); 


//Get Single Driver
router.get("/driver/:id", function(req, res, next){
    db.drivers.findOne({_id: new  ObjectId(req.params.id)},function(err, driver){
        if (err){
            res.send(err);
        }
        res.send(driver);
    });
});
});
module.exports = router;

var express = require("express");
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var uri = "mongodb+srv://karla001:sank@cluster-motoapp-2sfbw.mongodb.net";

MongoClient.connect(uri,  { useUnifiedTopology: true } , function(err, client){
var collection = client.db('db_motoapp').collection('driverlocation'); 


//upadate driver socket id

router.put("/driverLocationSocket/:id", function(req, res, next){

	var io = req.app.io;
	if(!req.body){
		res.status(400);
		res.json({
			"error":"Bad data"
		});

	}else{
		collection.update({_id: new  ObjectId(req.params.id)}, 
			{$set: {socketId:req.body.socketId}}, function(err, updateDetails){
				if(err){
					res.send(err);

				}else{
					res.send(updateDetails);
				}
		});
	}
});


//get nearby driver
router.get("/driverLocation", function(req, res, next){
	collection.createIndex({"coordinate":"2dsphere"});
	collection.find({
			"coordinate":{
				"$near":{
					"$geometry":{
						"type":"Point",
						"coordinates": [parseFloat(req.query.longitude), parseFloat(req.query.latitude)]
					},
					"$maxDistance":50000
				}
			}
		},
		     /*function(err, location){
			
	}*/).toArray(function(err, docs) {
		if(err){
			console.log(err);
		}else{
		console.log("Found the following records");
		console.log(docs);
		res.send(docs);
		}
	  });
});

//Get Single Driver and emit track by user to driver
router.get("/driverLocation/:id", function(req, res, next){
	var io = req.app.io;
    collection.findOne({driverId: req.params.id},function(err, location){
        if (err){
            res.send(err);
        }
        res.send(location);
        io.emit("trackDriver", location);
    });
});

//Update Location by driver to user
router.put("/driverLocation/:id", function(req, res, next){
    var io = req.app.io;
    var location = req.body;
    var latitude = parseFloat(location.latitude);
    var longitude = parseFloat(location.longitude);
    if (!location){
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    } else {
        collection.update({_id: mongojs.ObjectId(req.params.id)},{ $set: {
        	socketId:location.socketId,
        	coordinate:{
                "type": "Point",
        		coordinates:[
                    longitude,
        			latitude
    			]
    		}
    	}}, function(err, updateDetails){
        if (err){
            console.log(updateDetails);
            res.send(err);
        }
        if (updateDetails){

            //Get updated location
            collection.findOne({_id:  mongojs.ObjectId(req.params.id)},function(error, updatedLocation){
                if (error){
                    res.send(error);
                }
                res.send(updatedLocation);
                io.emit("action", {
                    type:"UPDATE_DRIVER_LOCATION",
                    payload:updatedLocation
                });
            });
        }
    });
    }
});
});
module.exports = router;

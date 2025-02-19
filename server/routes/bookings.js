var express = require("express");
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb+srv://karla001:sank@cluster-motoapp-2sfbw.mongodb.net";

MongoClient.connect(uri,  { useUnifiedTopology: true } , function(err, client){
var collection = client.db('db_motoapp').collection('bookings'); 


router.get("/bookings", function(req, res, next){	
	collection.find({}).toArray(function(err, bookings){
		if(err){
			res.send(err);
		}
		res.json(bookings);
	})
}); 

router.post("/bookings", function(req, res, next){
	var booking = req.body.data;
	
	var nearByDriver = req.body.nearByDriver;//
	var io = req.app.io;//

	if(!booking.username){
		res.status(400);
		res.json({
			error:"Bad data",
			
		});	
	} else {
		collection.save(booking, function(err, savedBooking){
			if(err){
				res.send(err);
			}
			res.json(savedBooking);
			if(nearByDriver.socketId){
				console.log(nearByDriver.socketId);
				io.emit(nearByDriver.socketId + "driverRequest", savedBooking);
			}else{
				console.log("Driver not connected");
			}
		});
	}
});

// Driver  Update Booking done on driver side
router.put("/bookings/:id", function(req, res, next){
    var io = req.app.io;
    var booking = req.body;
    if (!booking.status){
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    } else {
        collection.update({_id: MongoClient.ObjectId(req.params.id)},{ $set: { 
        	driverId: booking.driverId,
        	status: booking.status 
        }}, function(err, updatedBooking){
        if (err){
            res.send(err);
        }
        if (updatedBooking){
            //Get Confirmed booking
            collection.findOne({_id:  MongoClient.ObjectId(req.params.id)},function(error, confirmedBooking){
                if (error){
                    res.send(error);
                }
                res.send(confirmedBooking);
                io.emit("action", {
                    type:"BOOKING_CONFIRMED",
                    payload:confirmedBooking
                });
            });
        }
    });
    }
});

});


module.exports = router;

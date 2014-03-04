var Mongoose = require('mongoose');


var EventSchema = new Mongoose.Schema({
	"event": String,
	"date": Date,
	"description": String,
	"start_time": Number,
	"end_time": Number,
	"date_to_check": String
});

exports.Event = Mongoose.model('Event', EventSchema);
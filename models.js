var Mongoose = require('mongoose');


var EventSchema = new Mongoose.Schema({
	"event": String,
	"date": Date,
	"description": String,
	"start_time": Number,
	"end_time": Number
});

exports.Event = Mongoose.model('Event', EventSchema);
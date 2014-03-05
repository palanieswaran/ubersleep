
var Mongoose = require('mongoose');


var eventsSchema = new Mongoose.Schema({
	"event_name": String,
	"start_time": String,
	"end_time": String,
	"description": String,
	"date": String,
	"date_to_check": String
});

exports.Events = Mongoose.model('Events', eventsSchema);



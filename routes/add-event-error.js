var models = require('../models');

exports.view = function(req, res) { 
	var message = req.params.message;
	console.log("message: " + message);
	console.log("in add event error backend");
	res.render('add-event-error', {'message': message});
}
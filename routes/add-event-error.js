var models = require('../models');

exports.view = function(req, res) { 
	  if (typeof req.session.user === 'undefined') {
  	res.redirect('/');
  }
	var message = req.params.message;
	console.log("message: " + message);
	console.log("in add event error backend");
	res.render('add-event-error', {'message': message});
}
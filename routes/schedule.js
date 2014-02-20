var models = require('../models');


exports.view = function(req, res) { 

  /*var form_data = req.body;
  console.log("backend" + form_data);
	models.Event
		.find({"date": form_data["date"]})
		.sort('start_time')
		.exec(renderEvent);

	function renderEvent(err, events) {
		res.render('schedule', {'events': events});
	}*/

	res.render('schedule');
}

exports.renderPage = function(req, res) {
	var form_data = req.body;
  	console.log("backend" + form_data["date"]);
	models.Event
		.find({"date": form_data["date"]})
		.sort('start_time')
		.exec(renderEvent);

	function renderEvent(err, events) {
		res.render('schedule', {'events': events});
		console.log(events.length + " events");
	}
}
var models = require('../models');


exports.view = function(req, res) { 

  var form_data = req.body;
  console.log("backend" + form_data);
	models.Event
		.find()
		.sort('date')
		.sort('start_time')
		.exec(renderEvent);

	function renderEvent(err, events) {
		res.render('schedule', {'events': events});
	}
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
		for (var i = 0; i < events.length; i++) {
			console.log(events[i]["event"]);
			console.log("start time is: " + events[i]["start_time"]);
			console.log("end time is: " + events[i]["end_time"]);
		}
		console.log(events.length + " events");
	}
}
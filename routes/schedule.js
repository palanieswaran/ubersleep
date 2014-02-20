var models = require('../models');


exports.view = function(req, res) { 

  var form_data = req.body;
  console.log(form_data);

	models.Event
		.find({"date": form_data["date"]})
		.sort('start_time')
		.exec(renderEvent);

	function renderEvent(err, events) {
		res.render('schedule', {'events': events});
	}
}
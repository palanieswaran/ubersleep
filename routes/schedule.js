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
		var currDate = "";
		for (var i = 0; i < events.length; i++) {
			var date = events[i]["date"];
			var month=new Array();
			month[0]="January";
			month[1]="February";
			month[2]="March";
			month[3]="April";
			month[4]="May";
			month[5]="June";
			month[6]="July";
			month[7]="August";
			month[8]="September";
			month[9]="October";
			month[10]="November";
			month[11]="December";
			var fullMonth = month[date.getMonth()];

			var weekday=new Array(7);
			weekday[0]="Sunday";
			weekday[1]="Monday";
			weekday[2]="Tuesday";
			weekday[3]="Wednesday";
			weekday[4]="Thursday";
			weekday[5]="Friday";
			weekday[6]="Saturday";
			var fullDay = weekday[date.getDay()];

			var newDateString = fullDay + " " + fullMonth + " " + date.getDate() + ", " + date.getFullYear();
			console.log(newDateString);

			if (newDateString === currDate) {
				events[i]["modifiedDate"] = "";
				events[i]["links"] = false;
			} else {
				currDate = newDateString;
				events[i]["modifiedDate"] = newDateString;
				events[i]["links"] = false;
			}
		}
		res.render('schedule', {'events': events});
	}
}

exports.view2 = function(req, res) { 

  var form_data = req.body;
  console.log("backend" + form_data);
	models.Event
		.find()
		.sort('date')
		.sort('start_time')
		.exec(renderEvent);

	function renderEvent(err, events) {
		var currDate = "";
		for (var i = 0; i < events.length; i++) {
			var date = events[i]["date"];
			var month=new Array();
			month[0]="January";
			month[1]="February";
			month[2]="March";
			month[3]="April";
			month[4]="May";
			month[5]="June";
			month[6]="July";
			month[7]="August";
			month[8]="September";
			month[9]="October";
			month[10]="November";
			month[11]="December";
			var fullMonth = month[date.getMonth()];

			var weekday=new Array(7);
			weekday[0]="Sunday";
			weekday[1]="Monday";
			weekday[2]="Tuesday";
			weekday[3]="Wednesday";
			weekday[4]="Thursday";
			weekday[5]="Friday";
			weekday[6]="Saturday";
			var fullDay = weekday[date.getDay()];

			var newDateString = fullDay + " " + fullMonth + " " + date.getDate() + ", " + date.getFullYear();
			console.log(newDateString);

			if (newDateString === currDate) {
				events[i]["modifiedDate"] = "";
				events[i]["links"] = false;
			} else {
				currDate = newDateString;
				events[i]["modifiedDate"] = newDateString;
				events[i]["links"] = true;
				//events[i]["links"] = "<a id= \"add_ev\"  href=\"event-form2?date={{date}}\"> Add Event</a>    <a id= \"add_sl\"  href=\"sleep-form2?date={{date}}\"> Add Sleep</a>"
			}
		}
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
			console.log(events[i]["date"]);
			console.log("start time is: " + events[i]["start_time"]);
			console.log("end time is: " + events[i]["end_time"]);
		}
		console.log(events.length + " events");
	}
}
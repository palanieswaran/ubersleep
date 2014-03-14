var models = require('../models');
var express = require('express');
var app = express();

exports.view2 = function(req, res) { 
  var date2 = req.body.date;
  var user = req.body.user_name;
  console.log("user is: " + user);
  if (typeof user === 'undefined') {
  	console.log("in if");
  	user = req.session.user;
  } else {
  	console.log("in else");
  	req.session.user = user;
  }
  if (typeof req.session.user === 'undefined') {
  	console.log("before redirect");
  	console.log("req.session.user is " + req.session.user)
  	res.redirect('/');
  }
  console.log("username in schedule.js: " + user);
  /*if (user != '') {
  	app.locals({
  		user: user
  	});
  }
  console.log("app locals user is: " + app.locals.user);*/
  if (typeof date2 == 'undefined' || date2 == '') {
  	if (typeof req.session.date != 'undefined') {
  		date2 = req.session.date;
  	} else {
  		console.log("in null");
  		date2 = new Date().toString();
      	var month=new Array();
	      month["Jan"]="01";
	      month["Feb"]="02";
	      month["Mar"]="03";
	      month["Apr"]="04";
	      month["May"]="05";
	      month["Jun"]="06";
	      month["Jul"]="07";
	      month["Aug"]="08";
	      month["Sep"]="09";
	      month["Oct"]="10";
	      month["Nov"]="11";
	      month["Dec"]="12";
	      var monthNum = month[date2.substring(4,7)];

	      var date_to_check = date2.substring(11,15) + "-" + monthNum + "-" + date2.substring(8,10);
	      date2 = date_to_check;
  	}
      console.log("date2 after processing: " + date2);
  }
  models.Event
		.find({$and: [ {"date": date2}, {"User": user}]})
		.sort('start_time')
		.exec(renderEvent);

	function renderEvent(err, events) {
		var currDate = "";
		//set to start time initially, so that first event fills in previous hours
		var prev_end_time = "";
		if (events.length > 0) {
			prev_end_time = events[0]["start_time"];
		}
		for (var i = 0; i < events.length; i++) {
			console.log(events[i]["_id"]);
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

			if (events[i]["event"].substring(0, 5) === "Sleep") {
				sleepOrNot = 0;
			} else {
				sleepOrNot = 1;
			}

			var lengthOfEvent = events[i]["end_time"] - events[i]["start_time"];
			events[i]["lengthOfEvent"] = lengthOfEvent;
			events[i]["sleepOrNot"] = sleepOrNot;

			if (newDateString === currDate) {
				events[i]["modifiedDate"] = "";
				events[i]["links"] = false;
			} else {
				currDate = newDateString;
				events[i]["modifiedDate"] = newDateString;
				events[i]["links"] = true;
				//events[i]["links"] = "<a id= \"add_ev\"  href=\"event-form2?date={{date}}\"> Add Event</a>    <a id= \"add_sl\"  href=\"sleep-form2?date={{date}}\"> Add Sleep</a>"
			}

			events[i]["prev_end_time"] = prev_end_time;
			prev_end_time = events[i]["end_time"];
			events[i]["user"] = user;

		}
		if (events.length == 0) {
			var date3 = new Date(parseInt(date2.substring(0,4)), parseInt(date2.substring(5,7)) - 1, parseInt(date2.substring(8)));
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
			var fullMonth = month[date3.getMonth()];

			var weekday=new Array(7);
			weekday[0]="Sunday";
			weekday[1]="Monday";
			weekday[2]="Tuesday";
			weekday[3]="Wednesday";
			weekday[4]="Thursday";
			weekday[5]="Friday";
			weekday[6]="Saturday";
			var fullDay = weekday[date3.getDay()];

			var newDateString = fullDay + " " + fullMonth + " " + date3.getDate() + ", " + date3.getFullYear();
		}
		res.render('schedule2', {'events': events, 'date': date2, 'date_str': newDateString, 'user': user});
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
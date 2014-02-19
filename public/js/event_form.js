'use strict';

var models = require('../../events');

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	/*$("#testjs").click(function(e) {
		$('.jumbotron h1').text("Javascript is connected");
		$("#testjs").text("Thanks for clicking me!");
		$(".jumbotron p").toggleClass("active");
	});*/

	// Add any additional listeners here
	// example: $("#div-id").click(functionToCall);
	$("#submitBtn").click(addEvent); 
}

function addEvent(e) {
	var startTime = document.getElementById("start_time").value;
	var endTime = document.getElementById("end_time").value;
	var eventName = document.getElementById("event_name").value;
	var description = document.getElementById("description").value;
/*    var databaseURL = "mongodb://127.0.0.1:27017/test";	
	var collection = ["schedule"];
	var database = require("mongoose").connect(databaseURL, collection);
*/

	if (eventName === "") {
		alert('Please enter a name for your event');
	}
	else if (startTime >= endTime) {
		alert('Please enter a start time that is before the end time');
	}
	else {
		//alert ('gothurr');
		var newDoc = new models.Events({"event_name": eventName, "start_time": startTime, 
				"end_time": endTime, "description": description, "date": "today" 
				});
		//localStorage.setItem('newDoc.date',JSON.stringify(newDoc));
		//database.schedule.insert(newDoc);
		newDoc.save(afterSaving);

		function afterSaving(err) { // this is a callback
		  if(err) {console.log(err); res.send(500); }
		  res.redirect('/');
		}
		window.location.replace('schedule');
	}
}
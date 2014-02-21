'use strict';

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
	//$("#submitBtn").click(addEvent); 
	$('#submitBtn').click(addEvent); 
}



function addEvent(e) {
	  var query = window.location.search;
	  // Skip the leading ?, which should always be there, 
	  // but be careful anyway
	  if (query.substring(0, 1) == '?') {
	    query = query.substring(1);
	  }
	  var data = query.split(','); 
	  for (var i = 0; (i < data.length); i++) {
	    data[i] = decodeURI(data[i]);
	  }

	var startTime = document.getElementById("start_time").value;
	var endTime = document.getElementById("end_time").value;
	var eventName = document.getElementById("event_name").value;
	var description = document.getElementById("description").value;
	var date = document.getElementById("date").value;
/*    var databaseURL = "mongodb://127.0.0.1:27017/test";	
	var collection = ["schedule"];
	var database = require("mongoose").connect(databaseURL, collection);
*/

	if (eventName === "") {
		alert('Please enter a name for your event');
	}
	else if (parseInt(startTime) >= parseInt(endTime)) {
		alert('Please enter a start time that is before the end time');
	}
	else {
		var json = {
			'event': eventName,
			'date': date,
			'description': description,
			'start_time': parseInt(startTime),
			'end_time': parseInt(endTime)
		};
		$.post('/event/new', json, function() {
			window.location.href = 'schedule'; // reload the page
		});

	}
}
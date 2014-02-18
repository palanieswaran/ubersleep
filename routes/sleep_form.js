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
	$("#submitBtn").click(addEvent); 
}

function addEvent(e) {
	alert('blah');
	var startTime = $('#start_time');
	var endTime = $('#end_time');

	if (startTime > endTime) {
		alert('Please enter a start time that is before the end time');
	}
	else {
		//add values to database and return to schedule page
	}
}
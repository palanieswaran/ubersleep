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
	var sleepCycle = document.getElementById("sleep_cycle").value;
	var json = {
		'sleep_option': sleepCycle
	};
	$.post('/sleep/new', json, function() {
		window.location.href = 'schedule';
	})

}
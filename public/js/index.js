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
	$("#myCarousel").swiperight(function() {  
          $('.carousel').carousel('prev');  
    });  
    $("#myCarousel").swipeleft(function() {  
          $('.carousel').carousel('next');  
    });  
	$('#submitBtn').click(goBackToSchedule);
}

function goBackToSchedule(e) {

	var userName = document.getElementById("user_name").value;

	if (userName === "") {
		alert('Please enter a user name.');
		e.preventDefault();
	}
}
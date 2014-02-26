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

$('#deleteBtn').click(addEvent);

}



function addEvent(e) {
	function GetUrlValue(VarSearch){
	    var SearchString = window.location.search.substring(1);
	    var VariableArray = SearchString.split('&');
	    for(var i = 0; i < VariableArray.length; i++){
	        var KeyValuePair = VariableArray[i].split('=');
	        if(KeyValuePair[0] == VarSearch){
	            return KeyValuePair[1];
	        }
	    }
	}
var date_arr = GetUrlValue("date").split('%');
var date_str = "";
for (var i = 0; i < date_arr.length - 1; i++) {
	date_str += (date_arr[i] + " ");
}
date_str += (date_arr[date_arr.length-1]);

console.log("the date is:" + date_str);
console.log("the event is:" + GetUrlValue("event"));
var event_name = GetUrlValue("event");
  $.post('/delete/'+event_name + date_str +'/deleteEvent', function() {
window.location.href = 'schedule';
});
}
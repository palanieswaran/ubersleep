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

$('#deleteBtn').click(deleteEvent);

}

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


function deleteEvent(e) {
console.log("now entering deleteEvent");
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
var id = GetUrlValue("id");
var user = GetUrlValue("user");
console.log("id value in delete_form is: " + id);
//var date_arr = GetUrlValue("date").split('%');
//var date_str = "";
//for (var i = 0; i < date_arr.length - 1; i++) {
//	date_str += (date_arr[i] + " ");
//}
//date_str += (date_arr[date_arr.length-1]);

//console.log("the date is:" + date_str);
//console.log("the event is:" + GetUrlValue("event"));
//var event_name = GetUrlValue("event");

  var date_arr2 = GetUrlValue("date").split('%20');
  var date_str2 = "";
  for (var i = 0; i < date_arr2.length - 1; i++) {
    date_str2 += (date_arr2[i] + " ");
  }
  date_str2 += (date_arr2[date_arr2.length-1]);
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
      var monthNum = month[date_str2.substring(4,7)];

      var date_to_check2 = date_str2.substring(11,15) + "-" + monthNum + "-" + date_str2.substring(8,10);

  $.post('/delete/'+id+'/'+date_to_check2+'/deleteEvent', function() {
window.location.href = 'schedule2';
});
}
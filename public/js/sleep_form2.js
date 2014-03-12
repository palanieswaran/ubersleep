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
	var date = GetUrlValue("date");
	var user = GetUrlValue("user");
	/*var date_arr = GetUrlValue("date").split('%20');
	var date_str = "";
	for (var i = 0; i < date_arr.length - 1; i++) {
		date_str += (date_arr[i] + " ");
	}
	date_str += (date_arr[date_arr.length-1]);*/


	var next_X_days = document.getElementById("next_X_days").value;

	function getTomorrow(d,offset){
	    if(typeof(d) === "string"){
	        var t = d.split("-"); /* splits dd-mm-year */
	        d = new Date(t[2],t[1] - 1, t[0]);
	    //  d = new Date(t[2],t[1] - 1, t[0] + 2000); /* for dd-mm-yy */
	    }
	    return new Date(d.setDate(d.getDate() + offset));
	}

	var dates_arr = new Array();
	for (var i = 0; i < next_X_days; i++) {
		var our_date = date;
		var date_to_pass = our_date.substring(8) + "-" + our_date.substring(5,8) + our_date.substring(0,4);
		var new_d = getTomorrow(date_to_pass, i).toString();
		console.log("in dates_arr, before toString: " + getTomorrow(date_to_pass, i));
		console.log("in dates_arr, after toString: " + new_d);
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
	    var monthNum = month[new_d.substring(4,7)];

	    var date_to_check = new_d.substring(11,15) + "-" + monthNum + "-" + new_d.substring(8,10);
	    console.log("date_to_check in dates_arr after processing: " + date_to_check);
		dates_arr[i] = date_to_check;
	}

	for (var k = 0; k < dates_arr.length - 1; k++) {
		var json = {
			'sleep_option': sleepCycle,
			'date': dates_arr[k],
			'user': user
		};
		$.post('/sleep/new', json, function() {
			console.log("in first function");
		})
	}
		var json = {
			'sleep_option': sleepCycle,
			'date': dates_arr[dates_arr.length - 1],
			'user': user
		};
			$.post('/sleep/new', json, function() {
			window.location.href = 'schedule2';
		})

}
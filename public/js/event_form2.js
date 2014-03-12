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

/*function GetUrlValue(VarSearch){
	var SearchString = window.location.search.substring(1);
    var VariableArray = SearchString.split('&');
    for(var i = 0; i < VariableArray.length; i++){
        var KeyValuePair = VariableArray[i].split('=');
        if(KeyValuePair[0] == VarSearch){
        	return KeyValuePair[1];
        }
    }
}*/

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
	var description = document.getElementById("desc").value;
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
	var date_arr = GetUrlValue("date").split('%20');
	var date_str = "";
	for (var i = 0; i < date_arr.length - 1; i++) {
		date_str += (date_arr[i] + " ");
	}
	date_str += (date_arr[date_arr.length-1]);

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
	var monthNum = month[date_str.substring(4,7)];

	var date_to_check = date_str.substring(11,15) + "-" + monthNum + "-" + date_str.substring(8,10);

	if (eventName === "") {
		alert('Please enter a name for your event');
		e.preventDefault();
	}
	if (parseInt(startTime) >= parseInt(endTime)) {
		alert('Please enter a start time that is before the end time');
		e.preventDefault();
	}
	/*else {
		var json = {
			'event': eventName,
			'date': date_to_check,
			'description': description,
			'start_time': parseInt(startTime),
			'end_time': parseInt(endTime)
		};
		/*$.post('/event/new', json, function() {
			console.log("result is: " + res);
			window.location.href = schedule2; // reload the page
		});
	}*/
}
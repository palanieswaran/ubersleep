var models = require('../models');

exports.view = function(req, res) { 
	res.render('add-sleep');
}

//query data based on date.

exports.addsleep = function(req, res) {
	var form_data = req.body;
	var sleep_option = form_data["sleep_option"];
	console.log("Finding events on: " + form_data["date"]);
	models.Event
		.find({"date": form_data["date"]})
		.sort('start_time')
		.exec(renderEvent);

		function renderEvent(err, events) {
			if (events.length == 0) console.log ("no events!");
			for (var i = 0; i < events.length; i++) {
				console.log("event " + i + ": " + events[i]["event"]);
				console.log(events[i]["start_time"]);
				console.log(events[i]["end_time"]);
			}
			if (err) console.log(err);

			//boolean array. is_free[0] represents 12-12:30 being free.
			var is_free = new Array();
			for (var i = 0; i < 48; i++) {
				is_free[i] = "yes"
			}

			//fill boolean array with non-free timeslots
			for (var e = 0; e < events.length; e++) {
				var st = events[e]["start_time"];
				console.log("event " + e + "starts at: " + st);
				var et = events[e]["end_time"];
				console.log("event " + e + "ends at: " + et);

				for (var j = st; j < et; j++) {
					is_free[j] = "no"
				}
			}

			for (var i = 0; i < is_free.length; i++) {
				console.log("slot " + i + " is free? : " + is_free[i]);
			}

			//creates map (start_slot, length (in 30 minute slots))
			/*var map = {};
			for (var start = 0; start < 48; start++) {
				if (is_free[start] == "yes") {
					var orig_start = start;
					var length = 1;
					start++;
					for (var end = start; end < 48; end++) {
						if (is_free[end] == "yes") {
							length++;
							start++;
							map[orig_start] = length;
							//so maybe here add to the map and then increment map?
							//add in/update (orig_start, length)
						} else {
							map[orig_start] = length;
							break;
						}
					}
				}
			}

			//free_slots contains start times in ascending order by length
			var sorted = map.slice(0).sort(function(a, b) {
			   return a.value - b.value;
			});

			var free_slots = [];
			for (var i = 0, len = sorted.length; i < len; ++i) {
			    free_slots[i] = sorted[i].key;
			}*/

			var st_map = new Array();
			var len_map = new Array();
			var currIndex = 0;
			for (var start = 0; start < 48; start++) {
				if (is_free[start] == "yes") {
					var orig_start = start;
					var length = 1;
					if (orig_start == 47) {
						st_map[currIndex] = orig_start;
						len_map[currIndex] = length;
						console.log("start and ends just recorded. " + st_map[currIndex] + len_map[currIndex]);
					}
					start++;
					for (var end = start; end < 48; end++) {
						if (is_free[end] == "yes") {
							length++;
							start++;
							st_map[currIndex] = orig_start;
							len_map[currIndex] = length;
						} else {
							st_map[currIndex] = orig_start;
							len_map[currIndex] = length;
							console.log("start and ends just recorded. " + st_map[currIndex] + len_map[currIndex]);
							currIndex++;
							break;
						}
					}
				}
			}

			function sortWithIndices(toSort) {
			  for (var i = 0; i < toSort.length; i++) {
			    toSort[i] = [toSort[i], i];
			  }
			  toSort.sort(function(left, right) {
			    return left[0] < right[0] ? -1 : 1;
			  });
			  toSort.sortIndices = [];
			  for (var j = 0; j < toSort.length; j++) {
			    toSort.sortIndices.push(toSort[j][1]);
			    toSort[j] = toSort[j][0];
			  }
			  return toSort;
			}

			for (var i = 0; i < len_map.length; i++) {
				console.log("Length " + i + ": " + len_map[i]);
			}
			var len_map2 = len_map.slice(0);
			sortWithIndices(len_map2);
			var sortedmap = len_map2.sortIndices;
			//console.log(len_map.sortIndices.join(","));
			for (var i = 0; i < sortedmap.length; i++) {
				console.log("index is " + sortedmap[i]);
			}

			for (var i = 0; i < len_map.length; i++) {
				console.log("Length2 " + i + ": " + len_map[i]);
			}
			//console.log(len_map.sortIndices.join(","));

			//select proper sleep schedule to fill in
			var sleep_times = new Array();
			console.log("sleep option is " + sleep_option);
			if (sleep_option == 0) {
				sleep_times = new Array(10, 3);
			}
			if (sleep_option == 1) {
				sleep_times = new Array(6, 1, 1, 1);
			}
			if (sleep_option == 2) {
				sleep_times = new Array(1, 1, 1, 1);	
			}
			if (sleep_option == 3) {
				sleep_times = new Array(1, 1, 1, 1, 1, 1);
			}

			//finalMap contains (start_time, end_time) of sleep events. Init to all 0 to see which are filled.
			var finalMap = new Array();
			for (var p = 0; p < 48; p++) {
				finalMap[p] = 0;
			}

			//fills in finalMap. schedule_possible flipped to no if sleep does not fit in schedule.
			var schedule_possible = "yes";
			console.log("sleep times length is: " + sleep_times.length);
			console.log("sortedmap length is: " + sortedmap.length);
			for (var i = 0; i < sleep_times.length; i++) {
				var slot_found = "no";
				//sorted map contains in order, indices that correspond to the indices in st_map (for the start) and len_map (for the length)
				for (var j = 0; j < sortedmap.length; j++) {
					console.log("iteration " + j + ": current sleep time = " + sleep_times[i] + " , current len_map = " + len_map[sortedmap[j]] + " , current start time = " + st_map[sortedmap[j]]);
					if (sleep_times[i] <= len_map[sortedmap[j]]) {
						//add it to the final map
						finalMap[st_map[sortedmap[j]]] = st_map[sortedmap[j]] + sleep_times[i];
						console.log("Start time for block " + i + " is " + st_map[sortedmap[j]] + " and end time is " + finalMap[st_map[sortedmap[j]]]);
						//now that slot is no longer available, so remove it from st_map and len_map
						len_map[sortedmap[j]] = len_map[sortedmap[j]] - sleep_times[i];
						st_map[sortedmap[j]] = st_map[sortedmap[j]] + sleep_times[i];
						slot_found = "yes";
						break;
					}
				}
				if (slot_found == "no") {
					schedule_possible = "no";
				}
			}

			if (schedule_possible == "no") {
				console.log("not possible");
			} else {

				var curr_start = 0;
				var curr_end = 0;
				for (var i = 0; i < sleep_times.length; i++) {
					for (var j = curr_start; j < 48; j++) {
						if (finalMap[j] != 0) {
							//then j is the start time and finalMap[j] is end time
							curr_start = finalMap[j];
							curr_end = finalMap[j];
							console.log("start of sleep is " + j + " and will last until " + curr_end);
							var newEvent = new models.Event({
							    "event": "sleep" + i,
							    "date": form_data["date"],
							    "description": "Sleep cycle!",
							    "start_time": j,
							    "end_time": curr_end
						    });

						  newEvent.save(afterSaving);
						  break;

						  function afterSaving(err) {
						    if (err) {console.log(err); res.send(500); }
						  }
						}
					}
				}

			res.redirect("schedule");
			}
		}
}
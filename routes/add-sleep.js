var models = require('../models');

exports.view = function(req, res) { 
	res.render('add-sleep');
}

exports.view2 = function(req, res) { 
	res.render('add-sleep2');
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
			// I think I have to create an ever growing array where i add in the start time
			// and end time of each sleep block I allocate, and then I check to make sure
			// in the if statement that I am not within 4 of ANY of those numbers
			var prev_arr = [];
			for (var i = 0; i < sleep_times.length; i++) {
				var slot_found = "no";
				//sorted map contains in order, indices that correspond to the indices in st_map (for the start) and len_map (for the length)
				for (var j = 0; j < sortedmap.length; j++) {
					console.log("iteration " + j + ": current sleep time = " + sleep_times[i] + " , current len_map = " + len_map[sortedmap[j]] + " , current start time = " + st_map[sortedmap[j]]);
					var spot_too_close = "no";
					if (sleep_times[i] <= len_map[sortedmap[j]]) {
						//if both of the following conditions, then sleep cannot be spread out enough and this slot is skipped
						var adjusted_start_time = 0;
						var adjusted_found = 0;
			//if st_map[...] is within 4 of any elements of prev_arr
						for (var a = 0; a < prev_arr.length; a++) {
							//or if the end time st_map[sortedmap[j]] + sleep_times[i] is close to one

							// HERE YOU EDIT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! IMPLEMENT 2 COMMENTS BELOW, YOU GOT IT.
							// if stmap - prev is negative, we handle differently. if positive, handle this way.
							// if its negative then it needs to be > -4 and less than 0. in that case, immediately reject. 
							if ((Math.abs(st_map[sortedmap[j]] - prev_arr[a]) < 4) OR (Math.abs((st_map[sortedmap[j]] + sleep_times[i]) - prev_arr[a]) < 4)) {
								console.log("I ENTERED THE FIRST IF!")
								//below is not kosher either, because the end time is too close
								//below is only relevant for the tail end, as in when the new event added is AFTER prev_arr[a].
								//but what about when before?
								//I think any time this shit is too close before, this caveat is not in play
								if (len_map[sortedmap[j]] >= ((4 - Math.abs(st_map[sortedmap[j]] - prev_arr[a])) + sleep_times[i])) {
									console.log("I ENTERED THE SECOND!");
									//if you're too close to any of the prev_arr, it's no good.
									spot_too_close = "yes";
									break;
								} else {
									console.log("I ENTERED THE THIRD");
									//we enter here if our start spot is within 4 of another sleep time,
									// but the length of the start spot is long enough that we can start 4 past it
									adjusted_start_time = st_map[sortedmap[j]] + (4 - (Math.abs(st_map[sortedmap[j]] - prev_arr[a])));
									console.log("abs is: " + (Math.abs(st_map[sortedmap[j]] - prev_arr[a])));
									//we did find a time that is close to this a but not screwing us. so this is the option to ultimately go with,
									// but we still do need to check the others aren't screwing us
									adjusted_found = adjusted_start_time;
								}
							} else {
								console.log("I ENTERED THE REGULAR ONE!");
								adjusted_start_time = st_map[sortedmap[j]];
							}
						}
						if (spot_too_close == "yes") {
							spot_too_close = "no";
							continue;
						}
						console.log("adjusted found is: " + adjusted_found);
						if (adjusted_found != 0) {
							adjusted_start_time = adjusted_found;
						}
						if (prev_arr.length == 0) {
							adjusted_start_time = st_map[sortedmap[j]];
						}
						//add start and end times to prev_arr
						prev_arr.push(adjusted_start_time);
						prev_arr.push(adjusted_start_time + sleep_times[i]);
						//add it to the final map
						finalMap[adjusted_start_time] = adjusted_start_time + sleep_times[i];
						console.log("Start time for block " + i + " is " + st_map[sortedmap[j]] + " and end time is " + finalMap[adjusted_start_time]);
						//now that slot is no longer available, so remove it from st_map and len_map
						//this was a length that corresponded with the value of st_map[sortedmap[j]]
						len_map[sortedmap[j]] = len_map[sortedmap[j]] - sleep_times[i];

						len_map[sortedmap[j]] = len_map[sortedmap[j]] - sleep_times[i] + (st_map[sortedmap[j]] - adjusted_start_time);
						st_map[sortedmap[j]] = adjusted_start_time + sleep_times[i];
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
							    "event": "Sleep " + i,
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

			res.redirect("schedule2");
			}
		}
}
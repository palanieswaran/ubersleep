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
			var prev_start_arr = [];
			var prev_end_arr = [];
			for (var i = 0; i < sleep_times.length; i++) {
				var slot_found = "no";
				//sorted map contains in order, indices that correspond to the indices in st_map (for the start) and len_map (for the length)
				for (var j = 0; j < sortedmap.length; j++) {
					console.log("iteration " + j + ": current sleep time = " + sleep_times[i] + " , current len_map = " + len_map[sortedmap[j]] + " , current start time = " + st_map[sortedmap[j]]);
					var spot_too_close = "no";
					if (sleep_times[i] <= len_map[sortedmap[j]]) {
						//if both of the following conditions, then sleep cannot be spread out enough and this slot is skipped
						var curr_best_start = st_map[sortedmap[j]];
						var adjustment = 0;
						var adjusted_best_start = st_map[sortedmap[j]];
						var semi_too_close = "no";
						var pos = sortedmap[j];
						for (var b = 0; b < prev_end_arr.length; b++) {
							console.log("Part 1, before if: new block starting at " + st_map[pos] + " ending at " + (st_map[pos] + sleep_times[i]));
							console.log("Part 1, before if: block evaluated against -  start: " + prev_start_arr[b] + " end: " + prev_end_arr[b]);
							// if your start is before a given prev_end_arr[b], you need to be 4 buffer before
							// its start
							if (st_map[pos] < prev_end_arr[b]) {
								if ((st_map[pos] + sleep_times[i] + 6) <= prev_start_arr[b]) {
									curr_best_start = st_map[pos];
								} else {
									//so this is not an eligible spot. we need to check more ends.
									// if you hit this, the spot is TOO CLOSE TO ONE OF THE EXISTING SLEEPS ON THE EARLY END.
									// so this start spot sucks, you need to fuck it.
									spot_too_close = "yes";
									break;
								}
							}
						}
						if (spot_too_close == "yes") {
							spot_too_close = "no";
							continue;
						}

						// success, we made it down here. so the spot is far enough in front of all the spots.
						// now, we need to check that:
						// if your start is after prev_start_arr[a], you need to be 4 buffer (with adjust correction allowed)
						// after the ends of those same ones
						for (var a = 0; a < prev_start_arr.length; a++) {
							console.log("Part 2, before if: new block starting at " + st_map[pos] + " ending at " + (st_map[pos] + sleep_times[i]));
							console.log("Part 2, before if: block evaluated against: start: " + prev_start_arr[a] + "end: " + prev_end_arr[a]);
							if (st_map[pos] > prev_start_arr[a]) {
								if (prev_end_arr[a] + 6 <= st_map[pos]) {
									curr_best_start = st_map[pos];
								} else {
									console.log("Entering the complicated if. len_map is: " + len_map[pos]);
									if (len_map[pos] >= (6 - (st_map[pos] - prev_end_arr[a]) + sleep_times[i])) {
										adjustment = 6 - (st_map[pos] - prev_end_arr[a]);
										console.log("Entered second complicated. Adjustment = " + adjustment);
										curr_best_start = st_map[pos] + adjustment;
										adjusted_best_start = st_map[pos] + adjustment;
										semi_too_close = "yes";
									} else {
										spot_too_close = "yes";
										break;
									}
								}
							}
						}
						if (spot_too_close == "yes") {
							spot_too_close = "no";
							continue;
						}
						if (semi_too_close == "yes") {
							semi_too_close = "no";
							console.log("semi-too-close entered successfully!");
							curr_best_start = adjusted_best_start;
						}
						prev_start_arr.push(curr_best_start);
						prev_end_arr.push(curr_best_start + sleep_times[i]);
						//add it to the final map
						finalMap[curr_best_start] = curr_best_start + sleep_times[i];
						console.log("Start time for block " + i + " is " + curr_best_start + " and end time is " + (curr_best_start + sleep_times[i]));
						//now that slot is no longer available, so remove it from st_map and len_map
						//this was a length that corresponded with the value of st_map[sortedmap[j]]
						//len_map[sortedmap[j]] = len_map[sortedmap[j]] - sleep_times[i];

						len_map[sortedmap[j]] = len_map[sortedmap[j]] - sleep_times[i] - adjustment;
						st_map[sortedmap[j]] = curr_best_start + sleep_times[i];
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
							    "event": "Sleep " + (i + 1),
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
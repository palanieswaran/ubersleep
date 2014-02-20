var models = require('../models');

exports.view = function(req, res) { 
	res.render('add-sleep');
}

//query data based on date.

exports.addsleep = function(req, res) {
	var form_data = req.body;
	var sleep_option = form_data["sleep_option"];
	models.Event
		.find({"date": form_data["date"]})
		.sort('start_time')
		.exec(renderEvent);

		function renderEvent(err, events) {
			if (err) console.log(err);

			//boolean array. is_free[0] represents 12-12:30 being free.
			var is_free = new Array();
			for (var i = 0; i < 48; i++) {
				is_free[i] = "yes"
			}

			//fill boolean array with non-free timeslots
			for (var e; e < events.length; e++) {
				var elem = events[e];
				var st = elem["start_time"];
				var et = elem["end_time"];

				for (var j = st; j < et; j++) {
					is_free[i] = "no"
				}
			}

			//creates map (start_slot, length (in 30 minute slots))
			var map = {};
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
			}

			//select proper sleep schedule to fill in
			var sleep_times = new Array();
			if (sleep_option == 1) {
				sleep_times = [10, 3]
			}
			if (sleep_option == 2) {
				sleep_times = [6, 1, 1, 1]	
			}
			if (sleep_option == 3) {
				sleep_times = [1, 1, 1, 1]	
			}
			if (sleep_option == 4) {
				sleep_times = [1, 1, 1, 1, 1, 1]
			}

			//finalMap contains (start_time, end_time) of sleep events. Init to all 0 to see which are filled.
			var finalMap = {};
			for (var p = 0; p < 48; p++) {
				finalMap[p] = 0;
			}

			//fills in finalMap. schedule_possible flipped to no if sleep does not fit in schedule.
			var schedule_possible = "yes";
			for (var i = 0; i < sleep_times.length; i++) {
				var slot_found = "no";
				for (var j = 0; j < free_slots.length; j++) {
					if (sleep_times[i] <= map[free_slots[j]]) {
						//add it to the final map
						finalMap[free_slots[j]] = free_slots[j] + sleep_times[i];
						free_slots.splice(j, 1);
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
							curr_start = j;
							curr_end = finalMap[j];
						}
					}
					var newEvent = new models.Event({
					    "event": "sleep" + i,
					    "date": form_data["date"],
					    "description": "Sleep cycle!",
					    "start_time": curr_start,
					    "end_time": curr_end
					  });

					  newEvent.save(afterSaving);

					  function afterSaving(err) {
					    if (err) {console.log(err); res.send(500); }
					  }
				}

			res.redirect("schedule");
			}
		}
}
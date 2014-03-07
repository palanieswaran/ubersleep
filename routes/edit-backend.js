var models = require('../models');

exports.view = function(req, res) { 
	res.render('edit');
}

exports.viewError = function(req, res) {
  res.render('edit-event-error');
}

exports.edit = function(req, res) {
  var event_name = req.body.event_name;
  var description = req.body.desc;
  var id = req.body._id;
  var date = req.body.date;
  var start_time = req.body.start_time;
  var end_time = req.body.end_time;
  var date_to_check = date.substring(0);

  console.log("event to be added start time: " + start_time);
  console.log("event to be added end time: " + end_time);

  models.Event.find({"date_to_check": date_to_check,
        $or: [ {"start_time": start_time},
              {"end_time:": end_time},
              { $and: [ {"start_time": { $gt: start_time}}, {"start_time": { $lt: end_time}}]},
              { $and: [ {"start_time": { $lt: start_time }}, {"end_time": { $gt: start_time}}]},
              { $and: [ {"end_time": { $lt: end_time}}, {"end_time": { $gt: start_time}}]},
              { $and: [ {"end_time": { $gt: end_time}}, {"start_time": { $lt: end_time}}]},
              { $and: [ {"start_time": { $lt: end_time}}, {"end_time": { $gt: start_time}}]},
              { $and: [ {"end_time": { $gt: start_time}}, {"start_time": { $lt: end_time}}]}
              ] }).exec(checkOverlap);

  function checkOverlap(err, events) {
    console.log("here is length of events after the query: " + events.length);
    if(err) console.log(err);
    //if this has anything, we have an overlap so redirect back to schedule, can we send a message?
    if (events.length > 0) {
      for (var i = 0; i < events.length; i++) {
        console.log("These are the events that are overlapaping: ")
        console.log(events[i]);
        //here we need to forward 
        res.redirect('edit-event-error');
      }
      var message = 'this is an error message';
      console.log(message);
      //res.redirect('add-event-error?date=' + date_to_check + "?name=" + event_name + "?start_time=" + start_time + "?end_time=" + end_time);
    } else {
      console.log("entered else");
      console.log("id is: " + id);
      models.Event.find({"_id": id}).remove().exec(afterRemoving);

      function afterRemoving(err) {
        if (err) {console.log(err); res.send(500);}
        var newEvent = new models.Event({
        "event": event_name,
        "date": date,
        "description": description,
        "start_time": start_time,
        "end_time": end_time,
        //why is this field always undefined???? maybe we need to tell the JSON to expect it.
        "date_to_check": date_to_check
        });

        newEvent.save(afterSaving);

        function afterSaving(err) {
          console.log("addEventInEdit");
          if (err) {console.log(err); res.send(500); }
          res.redirect('schedule2');
        }

      }
    }
  }
}
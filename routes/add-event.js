var models = require('../models');

exports.view = function(req, res) { 
	res.render('add-event');
}

exports.view2 = function(req, res) { 
  res.render('add-event2');
}

exports.viewError = function(req, res) {
  var message = req.params.message;
  res.render('add-event-error');
}

exports.add = function(req, res) {
  var form_data = req.body;
  console.log(form_data);

  console.log("the date that will be printed is: " + form_data["date"]);
  //models.Event.find({}).exec(queryTest);
  //models.Project.find({"date": form_data["date"]}).exec(afterQuery);

  function queryTest(err, events) {
    if(err) console.log(err);
    console.log("here is a sample name: " + events[9]["event"]);
    console.log("here is a sample date: " + events[9]["date_to_check"]);
    console.log("here is a sample date2: " + events[9]["date_to_check2"]);
  }

  var date = form_data["date"];
  var date_to_check = date.substring(0);
  console.log("here is our date to check: " + date_to_check);

//start time: fd[st] OR end time: fd[et] OR (s_t gt fd[st] AND s_t lt fd[et]) OR (s_t lt fd[st] AND e_t gt fd[st]) OR 
// (et lt fd[et] AND et gt fd[st]) OR (et gt fd[et] AND st lt fd[et]) OR (st lt fd[et] AND et gt fd[st]) OR (et gt fd[st] AND st lt fd[et])

//issues with the start times and end times being stored as strings vs ints?
  
  var start_time = form_data["start_time"];
  var end_time = form_data["end_time"];

  var addEvent = true;

  /*models.Event.find({"date_to_check": date_to_check,
        $or: [ {"start_time": start_time},
              {"end_time: ": end_time},
              {"start_time": { $gt: start_time}, "start_time": { $lt: end_time}},
              {"start_time": { $lt: start_time}, "end_time": { $gt: start_time}},
              {"end_time": { $lt: end_time}, "end_time": { $gt: start_time}},
              {"end_time": { $gt: end_time}, "start_time": { $lt: end_time}},
              {"start_time": { $lt: end_time}, "end_time": { $gt: start_time}},
              {"end_time": { $gt: start_time}, "start_time": { $lt: end_time}}
              ] }).exec(checkOverlap);

  function checkOverlap(err, events) {

    if(err) console.log(err);
    //if this has anything, we have an overlap so redirect back to schedule, can we send a message?
    if (events.length > 0) {
      addEvent = false;
      res.redirect('add-event-error');      
      //$.get('/add-event-error/:message', function() {
      //window.location.href = 'add-event-error';
      //});
    }
  }*/

  if (addEvent === true) {
    var newEvent = new models.Event({
      "event": form_data["event"],
      "date": form_data["date"],
      "description": form_data["description"],
      "start_time": form_data["start_time"],
      "end_time": form_data["end_time"],
      //why is this field always undefined???? maybe we need to tell the JSON to expect it.
      "date_to_check": date_to_check
    });

    newEvent.save(afterSaving);

    function afterSaving(err) {
      if (err) {console.log(err); res.send(500); }
      console.log(addEvent);
      res.redirect('schedule2');

      /*var dateToSend = encodeURI(form_data["date"]);
      var json = {
       'date': form_data["date"]
      };
      $.post('/schedule/render', json, function() {
        window.location.href = 'schedule?' + dateToSend; // reload the page
      });*/
    
    }
  }
}


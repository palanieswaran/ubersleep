var models = require('../models');

var express = require('express');
var app = express();

exports.view = function(req, res) { 
  if (typeof req.session.user === 'undefined') {
    res.redirect('/');
  }
	res.render('add-event');
}

exports.view2 = function(req, res) { 
  if (typeof req.session.user === 'undefined') {
    res.redirect('/');
  }
  res.render('add-event2');
}

exports.viewError = function(req, res) { 
  if (typeof req.session.user === 'undefined') {
    res.redirect('/');
  }
  res.render('add-event-error');
}

exports.add = function(req, res) {
  if (typeof req.session.user === 'undefined') {
    res.redirect('/');
  }
  console.log("req: " + req);
  console.log("res: " + res);
  var event_name = req.body.event_name;
  console.log("params: " + req.body.length);
  var description = req.body.desc;
  var date = req.body.date;
  console.log("date: " + date);
  var start_time = req.body.start_time;
  var end_time = req.body.end_time;
  var date_to_check = date.substring(0);
  var user = req.body.user;
  console.log("user is: " + user);

  var user_arr = user.split('%20');
  var user_str = "";
  for (var i = 0; i < user_arr.length - 1; i++) {
    user_str += (user_arr[i] + " ");
  }
  user_str += (user_arr[user_arr.length-1]);
  console.log("user string in add-event.js: " + user_str);

  console.log("entered add-event.add");

  //var form_data = req.body;
  //console.log(form_data);

  //console.log("the date that will be printed is: " + form_data["date"]);
  //models.Event.find({}).exec(queryTest);
  //models.Project.find({"date": form_data["date"]}).exec(afterQuery);

  function queryTest(err, events) {
    if(err) console.log(err);
    console.log("here is a sample name: " + events[9]["event"]);
    console.log("here is a sample date: " + events[9]["date_to_check"]);
    console.log("here is a sample date2: " + events[9]["date_to_check2"]);
  }

  //var date = form_data["date"];
  //var date_to_check = date.substring(0);
  //console.log("here is our date to check: " + date_to_check);

//start time: fd[st] OR end time: fd[et] OR (s_t gt fd[st] AND s_t lt fd[et]) OR (s_t lt fd[st] AND e_t gt fd[st]) OR 
// (et lt fd[et] AND et gt fd[st]) OR (et gt fd[et] AND st lt fd[et]) OR (st lt fd[et] AND et gt fd[st]) OR (et gt fd[st] AND st lt fd[et])

//issues with the start times and end times being stored as strings vs ints?
  
  //var start_time = form_data["start_time"];
  //var end_time = form_data["end_time"];

  console.log("event to be added start time: " + start_time);
  console.log("event to be added end time: " + end_time);

  models.Event.find({"date_to_check": date_to_check, "User": user_str,
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
      }
      var message = 'this is an error message';
      res.redirect('add-event-error?date=' + date_to_check + "&name=" + event_name + "&start_time=" + start_time + "&end_time=" + end_time + "&user=" + user_str);
    } else {
      console.log("entered else");
      var newEvent = new models.Event({
      "event": event_name,
      "date": date,
      "description": description,
      "start_time": start_time,
      "end_time": end_time,
      //why is this field always undefined???? maybe we need to tell the JSON to expect it.
      "date_to_check": date_to_check,
      "User": user_str
      });

      newEvent.save(afterSaving);

      function afterSaving(err) {
        console.log("addEvent");
        if (err) {console.log(err); res.send(500); }
        //var date = req.body.date;
        //we want to pass date as post request
        res.redirect('schedule2');
      }
    }
  }


    /*var newEvent = new models.Event({
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
    
    //}
  
}


var models = require('../models');

exports.view = function(req, res) { 
	res.render('add-event');
}

exports.add = function(req, res) {
  var form_data = req.body;
  console.log(form_data);

  var newEvent = new models.Event({
    "event": form_data["event"],
    "date": form_data["date"],
    "description": form_data["description"],
    "start_time": form_data["start_time"],
    "end_time": form_data["end_time"]
  });

  newEvent.save(afterSaving);

  function afterSaving(err) {
    if (err) {console.log(err); res.send(500); }
    res.redirect('schedule');
    /*var dateToSend = encodeURI(form_data["date"]);
    var json = {
     'date': form_data["date"]
    };
    $.post('/schedule/render', json, function() {
      window.location.href = 'schedule?' + dateToSend; // reload the page
    });*/
  
  }

}
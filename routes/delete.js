var models = require('../models');

exports.view = function(req, res) {
	res.render('delete');
}

exports.deleteEvent = function(req, res) {
var event_name = req.params.event_name;
var date = req.params.date;

 /* models.Project.find({"event": event, "date": date}).remove().exec(afterRemoving);

  function afterRemoving(err) {
    if (err) {console.log(err); res.send(500);}
    res.redirect('schedule');
  }*/
}
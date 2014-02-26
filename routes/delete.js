var models = require('../models');

exports.view = function(req, res) {
	res.render('delete');
}

exports.deleteEvent = function(req, res) {
  var id = req.params.id;
  console.log(id);
  models.Event.find({"_id": id}).remove().exec(afterRemoving);

  function afterRemoving(err) {
    if (err) {console.log(err); res.send(500);}
    res.redirect('schedule');
  }
}
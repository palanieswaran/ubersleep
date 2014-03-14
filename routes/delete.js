var models = require('../models');

exports.view = function(req, res) {
    if (typeof req.session.user === 'undefined') {
    res.redirect('/');
  }
	res.render('delete');
}

exports.deleteEvent = function(req, res) {
  if (typeof req.session.user === 'undefined') {
    res.redirect('/');
  }
  var id = req.params.id;
  console.log("id is: " + id);
  models.Event.find({"_id": id}).remove().exec(afterRemoving);

  function afterRemoving(err) {

	var date = req.params.date;

  	var date_arr = date.split('%20');
  	var date_str = "";
  	for (var i = 0; i < date_arr.length - 1; i++) {
    	date_str += (date_arr[i] + " ");
  	}
  	date_str += (date_arr[date_arr.length-1]);

    req.session.date = date_str;

    if (err) {console.log(err); res.send(500);}
    res.redirect('schedule2');
  }
}
var models = require('../models');

exports.view = function(req, res) {
	res.render('delete');
}

exports.deleteEvent = function(req, res) {
  var id = req.params.id;
  console.log("id is: " + id);
  models.Event.find({"_id": id}).remove().exec(afterRemoving);

  function afterRemoving(err) {

	var user = req.params.user;

  	var user_arr = user.split('%20');
  	var user_str = "";
  	for (var i = 0; i < user_arr.length - 1; i++) {
    	user_str += (user_arr[i] + " ");
  	}
  	user_str += (user_arr[user_arr.length-1]);

    if (err) {console.log(err); res.send(500);}
    res.redirect('schedule2');
  }
}
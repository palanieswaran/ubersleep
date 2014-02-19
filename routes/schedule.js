var models = require('../events');


exports.view = function(req, res) { 
	/*var databaseURL = "mongodb://127.0.0.1:27017/test";
	var collection = ["schedule"];
	var database = require("mongoose").connect(databaseURL, collection);
	var array = database.collection.find().toArray(fucntion(err,events));
	*/
	var arrayToday[] = models.Events.find({"date": new Date ('today')});
	res.render('schedule',{'events':arrayToday});
}
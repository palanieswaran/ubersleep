
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var mongoose = require('mongoose');

var index = require('./routes/index');
var schedule = require('./routes/schedule');
var add_event = require('./routes/add-event');
var add_sleep = require('./routes/add-sleep');
var delete_js = require('./routes/delete');
var add_event2 = require('./routes/add-event');
var add_sleep2 = require('./routes/add-sleep');
var add_event_error = require('./routes/add-event-error');
var edit = require('./routes/edit-backend');
// var project = require('./routes/project');
// var palette = require('./routes/palette');
// Example route
// var user = require('./routes/user');

var local_database_name = 'heroku_app22187024';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri
mongoose.connect(database_uri);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', index.view);
app.get('/schedule', schedule.view);
app.get('/add-event', add_event.view);
app.get('/add-sleep', add_sleep.view);
app.get('/delete', delete_js.view);
app.get('/schedule2', schedule.view2);
app.get('/add-event2', add_event.view2);
app.get('/add-sleep2', add_sleep.view2);
app.get('/add-event-error', add_event.viewError);
app.get('/edit-event-error', edit.viewError);
app.get('/edit', edit.view);
app.post('/event/new', add_event.add);
app.post('/schedule/render', schedule.renderPage);
app.post('/sleep/new', add_sleep.addsleep);
app.post('/delete/:id/deleteEvent', delete_js.deleteEvent);
app.post('/edit/new', edit.edit);


//app.get('/project/:id', project.projectInfo);
//app.get('/palette', palette.randomPalette);
// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

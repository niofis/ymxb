'use strict';
/*jshint node:true */

var home = require('./controllers/home');

var api_users = require('./controllers/api/users');

exports.configure = function(app){

	app.all('/',home.controller);
	app.all('/home/:action?',home.controller);

	app.all('/api/users/:action?/:id?',api_users.controller);
}
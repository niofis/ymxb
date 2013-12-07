'use strict';
/*jshint node:true */

var ctrl = require('./controller').create();
exports.controller=ctrl.controller;

ctrl.map('GET','index',function (req,res,next){
	res.render('home/index',{title:"fijate"});
},'public');

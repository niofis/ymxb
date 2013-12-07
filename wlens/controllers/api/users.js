'use strict';

var ctrl = require('../controller').create();
exports.controller=ctrl.controller;

ctrl.map('GET','index',function (req,res,next){
	res.json({user:{name:'anonimous'}});
},'user');


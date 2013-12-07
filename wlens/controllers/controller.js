'use strict';
/*jshint node:true */

var _ = require('underscore');

exports.create=function(){
	var _methods = {
		GET:{},
		POST:{},
		PUT:{},
		DELETE:{}
	};
	var functions={};

	functions.controller = function(req,res,next){

		var action=_methods[req.method.toUpperCase()][req.params.action || 'index'];
		if(action){
			if(action.permit=='public'){
				action.action(req,res,next);
			} else {
				if(!req.user){
					res.redirect("/users/login?url=" + req.url);
				} else if(action.permit==='user'){
					action.action(req,res,next);
				} else if(req.user.roles[action.permit]){
					action.action(req,res,next);
				} else {
					functions.unauthorized(res);
				}
			}
		} else {
			functions.notFound(res);
		}
	}

	functions.map = function(methods,action_name,action,permit){
		var mts=methods.toUpperCase().split(" ");
		mts.forEach(function(m){
			_methods[m][action_name]={action:action, permit:permit};
		});
	}

	functions.notFound = function (res,message){
		var msg=message || 'Not found';
		res.status(404).send(msg);
	}

	functions.unauthorized = function(res,message){
		var msg = message || 'Unauthorized';
		res.status(401).send(msg);
	}

	functions.serverError = function(res,message){
		var msg = message || 'Server error';
		res.status(500).send(msg);
	}

	functions.badRequest = function (res,message){
		var msg = message || 'Bad request';
		res.status(400).send(msg);
	}



	return functions;
}
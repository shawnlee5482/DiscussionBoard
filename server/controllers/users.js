'use strict';

var mongoose = require('mongoose');
var Topics = mongoose.model('Topics');
var Post = mongoose.model('Posts');
var Comment = mongoose.model('Comments');
var Users = mongoose.model('Users');
var jwt = require('jsonwebtoken');

module.exports = (function() {
	return {
		dummyCreate: function(req, res, next) {
				var f = new Users({
					login: 'dummy', 
					password: 'password', 
					numTopic: 0, 
					numPost: 0, 
					numComment: 0
				});

				f.save(function(err) {
					if (err) {
						return next(err);
					} else {
						res.json(f);
					}
			});
		},
		login: function(req, res, next) {
			Users.findOne({login: req.body.login}, function(err, user) {
				if (err) {
					// throwing an error does nothing here, if it's not handled properly
					// no response is sent to the client
					return next(err);
				} else {
					if (!user) {
						res.json({success: false, message: 'user does not exist'});
					} else {
						// if login is new create user and return
						if (user.password != req.body.password) {
							res.json({success: false, message: 'password is not correct'});
						} else {
							var token = jwt.sign(user, app.get('superSecret'), {
								expiresIn: 3600*25 // expires in 24 hours
							});

							// return the information including token as JSON
							res.json({
								success: true,
								token: token,
								userinfo: user
							});
						}
					}
				}
			});
		},
		create: function(req, res, next) {
			// bad practice to console.log passwords.
			Users.findOne({login: req.body.login}, function(err, result) {
				if (err) {
					return next(err);
				} else {
					if (!result) {
						// if login is new create user and return
						var f = new Users({
							login: req.body.login, 
							password: req.body.password, 
							numTopic: 0, 
							numPost: 0, 
							numComment: 0
						});
				
						f.save(function(err) {
							if (err) {
								return next(err);
							} else {
								res.json({success:true, message: f});
							}
						});
					} else {
						res.json({success:false, message: 'user already exist'});
					}
				}

			});
		},
		check_duplicate: function(req, res, next) {
			Users.findOne({login: req.body.login}, function(err, result) {
				if (err) {
					return next(err);
				} else {
					if (!result) {
						res.json({success: true});
					} else {
						res.json({success:false, message: 'login already exist'});
					}
				}
			});
		},
		get: function(req, res, next) {
			Users.findOne({_id:req.params.id}, function(err, result) {   // find only one document
				if (err) {
				 	return next(err);
				} else {
					// calculate the number of topic, post, comment here
					Topics.find({_user:req.params.id}, function(err, results) {   // find all documents
						if (err) {
							return next(err);
						} else {
							result.numTopic = results.length;   // return it as json format

							Post.find({_user:req.params.id}, function(err, results) {   // find all documents
								if (err) {
								  return next(err);
								} else {
									result.numPost = results.length;   // return it as json format

									Comment.find({_user:req.params.id}, function(err, results) {   // find all documents
										if (err) {
											return next(err);
										} else {
											result.numComment = results.length;   // return it as json format
											res.json(result);   // return it as json format											
										}
									});									
								}
							});
						}
					});
				}
			})
		}		
	}
})();
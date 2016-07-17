
var mongoose = require('mongoose');
var Topics = mongoose.model('Topics');
var Post = mongoose.model('Posts');
var Comment = mongoose.model('Comments');
var Users = mongoose.model('Users');
var jwt = require('jsonwebtoken');

module.exports = (function() {
	return {
		dummyCreate: function(req, res) {
				var f = new Users({login:'dummy', password:'password', numTopic: 0, numPost: 0, numComment: 0});
				f.save(function(err) {
					if(err) {
						throw err;
					} else {
						console.log('Successfully saved', f);
						res.json(f);
					}
			});
		},
		login: function(req, res, app) {
			console.log('reqested login = ', req.body.login);
			Users.findOne({login: req.body.login}, function(err, user) {
				if(err) {
					throw err;
				} else {
					if(!user) {
						console.log('user does not exist');
						res.json({success: false, message: 'user does not exist'});
					} else {
						// if login is new create user and return
						if(user.password != req.body.password) {
							res.json({success:false, message: 'password is not correct'});
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
		create: function(req, res) {
			console.log('user create req.body.login, req.body.password', req.body.login, req.body.password);
			Users.findOne({login: req.body.login}, function(err, result) {
				if(err) {
					console.log('error in create of user', err);
					res.json({success:false, message: err});
				} else {
					if(!result) {
						// if login is new create user and return
						var f = new Users({login: req.body.login, password: req.body.password, numTopic: 0, numPost: 0, numComment: 0});
						console.log('f=', f);
						f.save(function(err) {
							if(err) {
								console.log('Error in saving');
								res.json({success:false, message: err});
							} else {
								console.log('Successfully saved', f); 
								res.json({success:true, message: f});
							}
						});
						
					} else {
						console.log('user already exist');
						res.json({success:false, message: 'user already exist'});
					}
				}

			});
		},
		get: function(req, res) {
			console.log('users controller req.params.id', req.params.id);
			Users.findOne({_id:req.params.id}, function(err, result) {   // find only one document
				if(err) {
				 	console.log(err);
				} else {
					// calculate the number of topic, post, comment here
					Topics.find({_user:req.params.id}, function(err, results) {   // find all documents
						if(err) {
						 console.log(err);
						} else {
							result.numTopic = results.length;   // return it as json format
							Post.find({_user:req.params.id}, function(err, results) {   // find all documents
								if(err) {
								 console.log(err);
								} else {
									result.numPost = results.length;   // return it as json format
									Comment.find({_user:req.params.id}, function(err, results) {   // find all documents
										if(err) {
										 console.log(err);
										} else {
											result.numComment = results.length;   // return it as json format
											console.log('users controller result=', result);
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
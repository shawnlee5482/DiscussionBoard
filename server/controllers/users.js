
var mongoose = require('mongoose');
var Topics = mongoose.model('Topics');
var Post = mongoose.model('Posts');
var Comment = mongoose.model('Comments');
var Users = mongoose.model('Users');

module.exports = (function() {
	return {
		create: function(req, res) {
			Users.findOne({name: req.body.name}, function(err, result) {
				if(err) {
					console.log('error in create of user', err);
					res.json(err);
				} else {
					if(!result) {
						// if name is new create user and return
						var f = new Users({name: req.body.name, numTopic: 0, numPost: 0, numComment: 0});
						console.log('f=', f);
						f.save(function(err) {
							if(err) {
								console.log('Error in saving');
							} else {
								console.log('Successfully saved', f); 
								res.json(f);		
							}
						});
						
					} else {
						console.log('user already exist');
						console.log('user = ', result);
						res.json(result);
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
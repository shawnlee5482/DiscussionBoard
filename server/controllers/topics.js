'use strict';

var mongoose = require('mongoose');
var Topics = mongoose.model('Topics');
var Post = mongoose.model('Posts');
var Comment = mongoose.model('Comments');

module.exports = (function() {
	return {
		up: function(req, res, next) {
			Post.findOneAndUpdate({ _id: req.params.id }, { $inc: { upCount: 1 } })
			  .select('upcount')
			  .exec(function(err, data) { 
			    if (err) { 
			      return next(err);
			    } else { 
			      res.json(data);			
			    } 
			  });
		},
		down: function(req, res, next) {
			Post.findOneAndUpdate({ _id: req.params.id }, { $inc: { upCount: -1 } })
			  .select('upcount')
			  .exec(function(err, data) { 
			    if (err) { 
			      return next(err);
			    } else { 
			      res.json(data);			
			    } 
			  });
		},
		index: function(req, res, next) {
			Topics.find({})
			.populate('_user')
			.populate('_post')  // population of comment is not necessary in the UI
			.exec(function(err, topics) { 
				if (err) {
					return next(err);
				} else {
					res.json(topics);
				}
			});
		},

		detailInfo: function(req, res, next) {
			Topics.findOne({_id: req.params.id})
			.populate('_user')
			.populate('_post')
			.populate({path: '_post', populate: {path: '_comments', populate: {path: '_user'}}})  // need to populate comments as well		
			.populate({path: '_post', populate: {path: '_user'}})  // need to populate comments as well
			.exec(function(err, topic) {
				if (err) {
				  return next(err);
				} else {
					res.json(topic);				
				}
			});			
		},

		addPost: function(req, res, next) {
			Topics.findOne({_id: req.params.id})
			.populate('_post')
			.exec(function(err, topic) {   // find all documents and get document by index
				if (err) {
				  return next(err);
				} else {

					var newPost = new Post({
						_topic: topic._id, 
						postContent: req.body.postContent, 
						imageURL: req.body.imageURL, 
						_user: req.body.id,
						comments: [], 
						upCount: 0, 
						downCount:0
					});

					newPost.save(function(err) {
						if (err) {
							return next(err);
						} else {

							topic._post.push(newPost);

							topic.save(function(err) {
								if (err) {
									return next(err);
								} else {
									res.json(topic._post);
								}
							});								
						}
					});
				}
			});
		},	
		addComment: function(req, res, next) {
			Post.findOne({_id:req.params.id})
			.populate('_comments')
			.exec(function(err, post) {   // find all documents and get document by index
				if (err) {
				  return next(err);
				} else {
				
					var newComment = new Comment({
						_topic: req.body.topicId,
						_post: post._id, 
						comment: req.body.comment, 
						_user:req.body.userId
					});

					newComment.save(function(err) {
						if (err) {
							return next(err);
						} else {
							post._comments.push(newComment);
							post.save(function(err) {
								if (err) {
									return next(err);
								} else {
									res.json(post);
								}
							});								
						}
					});
				}
			});
		},			
		create: function(req, res, next) {
			var f = new Topics({
				category: req.body.category, 
				topic: req.body.topic, 
				imageURL: req.body.imageURL, 
				_user: req.body.id, 
				description: req.body.description, 
				numPosts: 0, 
				date: req.body.date
			});

			f.posts = [];
			f.save(function(err) {
				if (err) {
					return next(err);
				} else {
					// this goes here; otherwise, create will always send a 200 response
					// even if the save() failed
				  res.json(f);	
				}
			});
		}		
	}

})();
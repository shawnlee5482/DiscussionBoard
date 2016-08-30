
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
		down: function(req, res) {
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
		index: function(req, res) {
			Topics.find({})
			.populate('_user')
			.populate('_post')  // population of comment is not necessary in the UI
			.exec(function(err, topics) { 
				if(err) {
				 console.log(err);
				} else {
					res.json(topics);
				}
			});
		},

		detailInfo: function(req, res) {
			Topics.findOne({_id: req.params.id})
			.populate('_user')
			.populate('_post')
			.populate({path: '_post', populate: {path: '_comments', populate: {path: '_user'}}})  // need to populate comments as well		
			.populate({path: '_post', populate: {path: '_user'}})  // need to populate comments as well
			.exec(function(err, topic) {
				if(err) {
				 console.log(err);
				} else {
					console.log('topic controller:', req.params.id);
					console.log('topic controller:', topic);
					res.json(topic);				
				}
			});			
		},

		addPost: function(req, res) {
			Topics.findOne({_id: req.params.id})
			.populate('_post')
			.exec(function(err, topic) {   // find all documents and get document by index
				if(err) {
				 console.log(err);
				} else {
					console.log('topic controller:', req.params.id);
					console.log('topic controller:', topic)
					console.log('topic controller input parameter:', req.body.postContent, req.body.imageURL, req.body.id);
					var newPost = new Post({_topic:topic._id, postContent:req.body.postContent, imageURL: req.body.imageURL, _user:req.body.id,
						comments:[], upCount: 0, downCount:0});

					newPost.save(function(err) {
						if(err) {
							console.log('newPost save error');
						} else {
							topic._post.push(newPost);

							topic.save(function(err) {
								if(err) {
									res.json(err);
								} else {
									console.log('topic controller addPost:', topic._post);
									res.json(topic._post);
								}
							});								
						}

					});
				}
			});

		},	
		addComment: function(req, res) {
			Post.findOne({_id:req.params.id})
			.populate('_comments')
			.exec(function(err, post) {   // find all documents and get document by index
				if(err) {
				 console.log(err);
				} else {
					console.log('topic controller addComment', post);
					console.log('topic controller input parameter:', req.body.topicId, req.body.comment, req.body.userId);

					var newComment = new Comment({_topic:req.body.topicId, _post:post._id, comment:req.body.comment, _user:req.body.userId});

					newComment.save(function(err) {
						if(err) {
							console.log('newPost save error');
						} else {
							post._comments.push(newComment);
							post.save(function(err) {
								if(err) {
									console.log('topic controller addComment: Error occured');
								} else {
									console.log('topic controller addComment:', post);
									return res.json(post);
								}
							});								
						}

					});
				}
			});

		},			
		create: function(req, res) {
			var f = new Topics({category:req.body.category, topic:req.body.topic, imageURL: req.body.imageURL, _user:req.body.id, description:req.body.description, numPosts: 0, date:req.body.date});
			console.log('f=', f);
			f.posts = [];
			f.save(function(err) {
				if(err) {
					console.log('Error in saving');
				} else {
					console.log('Successfully saved', f); 		
				}
			});
			res.json(f);
		}		
	}

})();
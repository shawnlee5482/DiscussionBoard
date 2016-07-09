var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new mongoose.Schema({
	 _topic: {type: Schema.Types.ObjectId, ref: 'Topics'},	// to specify parent
	 postContent: String, 
	 _user: {type: Schema.Types.ObjectId, ref: 'Users'},
	 _comments: [{type: Schema.Types.ObjectId, ref: 'Comments'}],  // to associate comment(childs)
	 upCount: Number,
	 downCount: Number
}, {timestamps: true});

mongoose.model('Posts', postSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new mongoose.Schema({
	 // since this is a reference to a different document, the _ is the naming convention!
	 _post: {type: Schema.Types.ObjectId, ref: 'Posts'},  // Post is the parent
	 comment: String, 
	 _user: {type: Schema.Types.ObjectId, ref: 'Users'},
	 date: {type: Date, default: new Date}
}, {timestamps: true});

mongoose.model('Comments', commentSchema);
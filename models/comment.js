const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = mongoose.model(
	"Comment", 
	new Schema({
		name: {type: String, required: true},
		comment: {type: String, required: true},
		time: {type: String, required: true},
		writtenIn: {type: Schema.Types.ObjectId, ref: 'Post', required: true},
	})
)

module.exports = Comment;
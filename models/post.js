const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const PostSchema = new mongoose.Schema(
	{
		title: {type: String, required: true},
		text: {type: String, required: true},
		time: {type: String, required: true},
		postedBy: {type: Schema.Types.ObjectId, ref: 'Admin', required: true},
		isPublished : {type:Boolean, required: true}
	}, 
	{
		toJSON: {virtuals: true}
	}
);


PostSchema.virtual('truncated_text')
		  .get(function () {
		  	return this.text.substring(0, 150);
});

module.exports = mongoose.model('Post', PostSchema);
const Post = require('../models/post');
const Comment = require('../models/comment');
const { body,validationResult } = require("express-validator");

exports.blog_list = (req, res, next) => {
	Post.find({isPublished: true}, 'title text truncated_text')
	.exec((err, posts) => {
		if (err) { 
			res.sendStatus(500);  
			return; 
		}
		res.status(200).json(posts);
	})
};

exports.blog_detail = (req, res, next) => {
	Post.findById(req.params.id)
	.populate('postedBy', 'Adminname')
	.exec((err, blogDetail) => {
		if (err) { 
			res.sendStatus(404); 
			return; 
		}
		res.status(200).json(blogDetail)
	})
};

exports.blog_comment = (req, res, next) => {
	Comment.find({writtenIn : req.params.id})
	.populate('writtenIn')
	.exec((err, blogComments) => {
		if (err) { 
			res.sendStatus(404);
			return;
		}
		res.status(200).json(blogComments)
	})
};

exports.post_blog_comment = [
//validation and sanitation
	body('name', 'You must specify a name').trim().exists().escape(),
	body('comment', 'Comment must be atleast 5 characters').trim().isLength({min:5}).escape(),

	(req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			const msg = {message: 'You must specify a name & Comment must be atleast 5 characters.'}
			res.status(200).json(msg)
			return;
		}
		const newComment = new Comment(
			{
				name: req.body.name,
				comment: req.body.comment,
				time: new Date().toLocaleString(),
				writtenIn: req.params.id,
			})
		newComment.save(err => {
				if (err) { 
					res.sendStatus(400);
					return;
				}
				const msg = {message: 'Comment Saved'}
				res.status(200).json(msg)
			})
	} 
];
const Post = require('../models/post');
const Comment = require('../models/comment');
const Admin = require('../models/admin');
const { body,validationResult } = require("express-validator");

exports.show_blog_list = (req, res, next) => {
	Post.find({}, 'title text truncated_text')
	.exec((err, posts) => {
		if (err) { 
			res.sendStatus(500);  
			return; 
		}
		res.status(200).json(posts);
	})
};

exports.create_blog = [
	//validation and sanitation
	body('title', 'You must specify a title').trim().exists().escape(),
	body('text', 'Text must be atleast 50 characters').trim().isLength({min:50}).escape(),
	body('ispublished', 'Must check one').exists().escape(),

	(req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			const msg = {message: 'You must specify a title &  text must be atleast 50 characters.'}
			res.status(200).json(msg);
			return;
		}
		Admin.find().exec((err, adminlist) =>{
			if (err) {console.log(err); return;}
			const newPost = new Post(
					{
						title:  req.body.title,
						text: req.body.text,
						time: new Date().toLocaleString(),
						postedBy: adminlist[0]._id,
						isPublished: req.body.ispublished
					});
			newPost.save(err => {
				if (err) { 
					res.sendStatus(404); 
					console.log(err);
					return; 
				}
				const msg = {message: 'Blog Saved'}
				return res.status(200).json(msg);
			})
	})
  }
];

exports.show_blog_detail = (req, res, next) => {
	Post.findById(req.params.id)
	.populate('postedBy', 'Adminname')
	.exec((err, blogDetail) => {
		if (err) { 
			res.sendStatus(404); 
			return; 
		}
		res.status(200).json(blogDetail);
	})
};


exports.update_blog =  [
//validation and sanitation
	body('title', 'You must specify a title').trim().exists().escape(),
	body('text', 'Text must be atleast 10 characters').trim().isLength({min:10}).escape(),
	body('ispublished', 'Must check one').exists().escape(),

	(req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			const msg = {message: 'You must specify a title & text must be atleast 10 characters.'}
			res.status(200).json(msg)
			return;
		}
		console.log('h');
		Admin.find().exec((err, adminlist) =>{
			if (err) {console.log(err); return;}
			const newPost = new Post(
					{
						 _id: req.params.id,
						title:  req.body.title,
						text: req.body.text,
						time: new Date().toLocaleString(),
						postedBy: adminlist[0]._id,
						isPublished: req.body.ispublished
					});
			Post.findByIdAndUpdate(req.params.id, newPost, {} , (err,newpost) => {
				if (err) { 
					res.sendStatus(404); 
					console.log(err);
					return; 
				}
				const msg = {message: 'Blog Updated'}
				return res.status(200).json(msg);
			})
		})
	}
]

exports.delete_blog = (req, res, next) => {
	Post.findByIdAndRemove(req.params.id, function deletePost(err){
		if (err) {
					res.sendStatus(500);
					return;
				}
		return res.status(200).json({
		            success:true,
		            redirectUrl: '/'
		        })

	})
}

exports.show_comments = (req, res, next) => {
	Comment.find({writtenIn : req.params.id})
	.populate('writtenIn')
	.exec((err, blogComments) => {
		if (err) { 
			res.sendStatus(404);
			return;
		}
		res.status(200).json(blogComments)
	})
}

exports.confirm_delete_comment = (req, res, next) => {
	Comment.findById(req.params.id)
			.exec((err, comment) => {
				if (err) { 
					console.log('hi');
					res.sendStatus(404);
					return;
				}
				res.status(200).json(comment)
			})
}

exports.delete_comment = (req, res, next) => {
	Comment.findByIdAndRemove(req.params.id, function deleteComment(err){
		if (err) {
					res.sendStatus(500);
					return;
				}
		return res.status(200).json({
		            success:true,
		            redirectUrl: '/'
		        })

	})
}



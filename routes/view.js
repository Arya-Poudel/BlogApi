const express = require('express');
const router = express.Router();
const view_controller = require('../controllers/viewController');

//show homepage
router.get('/blogs', view_controller.blog_home);
//show all blogs
router.get('/blogs', view_controller.blog_list );
//show detail of a blog
router.get('/blogs/:id', view_controller.blog_detail );
//show comments in a blog
router.get('/blogs/:id/comments', view_controller.blog_comment );
//create new comment
router.post('/blogs/:id/comments', view_controller.post_blog_comment);

module.exports = router;
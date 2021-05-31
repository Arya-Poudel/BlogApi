const express = require('express');
const router = express.Router();
const admin_controller = require('../controllers/adminController');
const CheckAdmin = require('../controllers/CheckAdmin');


//check if admin
router.post('/', CheckAdmin);
//show all blogs
router.get('/blogs', admin_controller.show_blog_list);
//create new blog
router.post('/blogs/new', admin_controller.create_blog);
//show detail of a blog
router.get('/blogs/:id', admin_controller.show_blog_detail);
//update the blog
router.put('/blogs/:id', admin_controller.update_blog);
//delete the blog
router.delete('/blogs/:id/delete', admin_controller.delete_blog);
//show comments in a blog
router.get('/blogs/:id/comments', admin_controller.show_comments);
//show form to confirm deletion of comment
router.get('/blogs/comments/:id/delete', admin_controller.confirm_delete_comment);
//delete the comment
router.delete('/blogs/comments/:id/delete', admin_controller.delete_comment);


module.exports = router;
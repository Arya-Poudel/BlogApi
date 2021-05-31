const jwt= require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Admin = require('../models/admin');

const checkAdmin = (req, res) => {

  Admin.findOne({ Adminname: req.body.Adminname }, (err, admin) => {
      if (err) { 
	        res.sendStatus(500);  
			return; 
      };
      if (!admin) {
       		const msg = {message: 'No such admin'}
					res.status(200).json(msg);
					return;
      }
	  bcrypt.compare(req.body.password, admin.password, (err, response) => {
		  if (response) {
		    jwt.sign({admin}, 'somesecretkey', (err, token) => {
		    	if (err) {
		    		res.sendStatus(500);
		    		return;
		    	}
		    	res.status(200).json({token: token, message:'Welcome'});
		    	return;
		    })
	     }
	     else{
	           const msg = {message: 'Incorrect password'}
					   res.status(200).json(msg);
					   return;
	     }
	  })	
    });
}


module.exports = checkAdmin;
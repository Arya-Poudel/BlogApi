const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require('cors');
const jwt= require('jsonwebtoken')
const compression = require('compression');

const app = express();

app.use(compression()); //compress all routes

//import routes
const viewRouter = require('./routes/view')
const adminRouter = require('./routes/admin');

const CheckAdmin = require('./controllers/CheckAdmin');

const mongoDb = process.env.MONGODB_URI;
mongoose.set('useFindAndModify', false);
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

//allow access only from the specified websites
const allowedOrigins = ['https://arya-poudel.github.io/BlogViewer/#/',
                      'https://arya-poudel.github.io/BlogAdmin/#/'];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', viewRouter);
app.use('/beAdmin', CheckAdmin);
app.use('/admin', verifyToken, adminRouter);

function verifyToken(req, res, next) {
	//get auth header value
	const bearerHeader = req.headers.authorization;
	//check if undefined
	if (typeof bearerHeader !== 'undefined') {
		jwt.verify(bearerHeader, 'somesecretkey', (err, authData)=>{
			if (err) {res.sendStatus(403); return;}
			else{
					next();	
			}
		})
	} else{
		//forbiddern
		res.sendStatus(403).json({msg: 'Unauthorized'});
		return;
	}
}

const host = '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, function() {
  console.log("Server started.......");
})
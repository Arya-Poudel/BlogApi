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

//allow access from anywhere for now
app.use(cors());

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
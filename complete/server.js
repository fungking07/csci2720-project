const express = require('express');
var cors = require('cors')
const app = express();
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded({extended:false}));
//app.use(bodyParser.json());
app.use(express.json());

var cors = require('cors');
app.use(cors());

const SECRET = "csci2720";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://s1155095200:x08938@localhost/s1155095200');

var db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console,'Connection error:'));
// Upon opening the database successfully
db.once('open', function () {
console.log("Connection is open...");
});

var userSchema = Schema({
	name: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	favorite: [{ type: Schema.Types.ObjectId, ref: 'Place' }],
	comment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	admin: { type: Boolean, required: true}
});

var placeSchema = Schema({
	name: { type: String, required: true, unique: true },
	latitude: { type: Number, required: true },
	longitude: { type: Number, required: true },
	waitTime: { type: Number, required: true },
	updateTime: { type: Number, required: true },
	comment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

var commentSchema = Schema({
	content: { type: String, required: true},
});

var Place = mongoose.model('Place', placeSchema);
var User = mongoose.model('User', userSchema);
var Comment = mongoose.model('Comment', commentSchema);

const authUser = async (req, res, next) => {
	//console.log(req.headers);
	const raw = String(req.headers.authorization).split(' ').pop();
	// find Object_id  of user in database
	console.log(raw);
	try {
		const { id } = jwt.verify(raw, SECRET);
		//console.log(id);
		req.user = await User.findById(id);
		console.log(req.user);
		next();
	}
	catch(e) {
		console.log("invalid token");
		req.status = false;
	}
}

const authAdmin = async (req, res, next) => {
	//console.log(req.headers);
	const raw = String(req.headers.authorization).split(' ').pop();
	// find Object_id  of user in database
	console.log(raw);
	try {
		const { id } = jwt.verify(raw, SECRET);
		//console.log(id);
		req.user = await User.findById(id);
		console.log(req.user);
		if (req.user.admin == false) {
			console.log("no access right");
			return;
		}
		next();
	}
	catch(e) {
		console.log("invalid token");
		req.status = false;
	}
	

}

app.post('/register', function(req,res) {
	console.log(req.body);
	User.create({
		name: req.body.username,
		password: require('bcryptjs').hashSync(req.body.password,10),
		admin: false
	},function (err, place) {
		if (err) return handleError(err);
	});
	res.send("ok");
});

app.post('/login',  function(req,res) {
	console.log(req.body);
	User.findOne({
		name: req.body.username
	}).exec(function (err,user) {
		//console.log(user);
		if (err) return handleError(err);
		if (user === null) {
			return res.send("no found");
		}
		const isPasswordValid = require('bcryptjs').compareSync(
			req.body.password,
			user.password)
		if(!isPasswordValid) {
			return res.send("wrong password!");
		}
		const token = jwt.sign({　
			//id_token is here
			id: String(user._id)

		}, SECRET);
		res.send({
			user,
			token: token
		});
	})
});

app.get('/test', authAdmin, function(req,res) {
	console.log(req.status);
	if(req.status == false) {
		res.send("need permision");
	}
	else {
		res.send("get test data");
	}
	
});

// listen to port x
const server = app.listen(2009);

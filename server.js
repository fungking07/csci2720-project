const express = require('express');
const app = express();
const fetch = require('node-fetch');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

/*
	Coordinates chosen for the hospital unless specfied, using coordinates from google maps
*/
gps_dictionary={
	 "Alice Ho Miu Ling Nethersole Hospital":	[22.45913185742467,  114.17469068876338], 
     "Caritas Medical Centre":					[22.341772912666165, 114.15320232677372], 
     "Kwong Wah Hospital":						[22.31541006804377,  114.17240266910228], 
     "North District Hospital":					[22.497087757325254, 114.12469079794036], 
     "North Lantau Hospital":					[22.282266349922747, 113.9392599691018], 
     "Princess Margaret Hospital":				[22.341668612896427, 114.13373546725335], 
     "Pok Oi Hospital":							[22.445004779595717, 114.0420270678224], 	// Coordiantes of A&E
     "Prince of Wales Hospital":				[22.38079103788961,  114.20195365848012],	// Coordiantes of A&E
     "Pamela Youde Nethersole Eastern Hospital":[22.269277042925737, 114.23544138768872], 	// Coordiantes of Emergency Room
     "Queen Elizabeth Hospital":				[22.30955973314367,  114.17606620922312], 	// Coordiantes of A&E
     "Queen Mary Hospital":						[22.27077146378893,  114.1313066074947],	// Coordiantes of Emergency Room
	 "Ruttonjee Hospital":						[22.27587303226667,  114.17531096773565],
     "St John Hospital":						[22.20808237968386,  114.03163397237024], 
     "Tseung Kwan O Hospital":					[22.31737229464226,  114.27027219094613], 	// Coordiantes of A&E
     "Tuen Mun Hospital":						[22.407044471010426, 113.9762685280754], 	// Coordiantes of A&E
     "Tin Shui Wai Hospital":					[22.458752601246452, 113.99582695694608], 	// Coordiantes of A&E
     "United Christian Hospital":				[22.322312351570925, 114.22800587362383],	// Coordiantes of A&E
     "Yan Chai Hospital":						[22.36973757058297,  114.11960031686614]
};

var mongoose = require('mongoose');
const { read } = require('node:fs');
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
	password: { type: String, required: true },//need to fulfill hash later
	favorite: [{ type: Schema.Types.ObjectId, ref: 'Place' }],
	isAdmin: [{ type: Boolean}]
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
	author: { type: String, required: true},
	content: { type: String, required: true}
});

var Place = mongoose.model('Place', placeSchema);
var User = mongoose.model('User', userSchema);
var Comment = mongoose.model('Comment', commentSchema);

//load the data from hospAPI and store them in database at the first time
app.get('/init', function(req,res) {
	let hospAPI = "http://www.ha.org.hk/opendata/aed/aedwtdata-en.send";
	let settings = { method: "Get" };
	// fetch hospData through HospAPI
	fetch(hospAPI, settings)
	    .then(res => res.json())
	    .then((json) => {
	    	//console.log(json["updateTime"]);
	    	json["waitTime"].forEach((item)=>{
	    		//console.log(item.hospName+" "+ item.topWait.match(/\d+/)[0]+"\n");		
	    		Place.create({
	    			name:item.hospName,
	    			latitude: gps_dictionary[item.hospName][0],
	    			longitude: gps_dictionary[item.hospName][1],
	    			waitTime: Number(item.topWait.match(/\d+/)[0]),
	    			updateTime: 0
	    		},function (err, place) {
	    			if (err) return handleError(err);
	    		})
	    		
	    	});
		   res.send("Init successfully!");
		});
});

//reload and update the data stored in database after first time
app.get('/update', function(req,res) {
	let hospAPI = "http://www.ha.org.hk/opendata/aed/aedwtdata-en.send";
	let settings = { method: "Get" };

	fetch(hospAPI, settings)
	    .then(res => res.json())
	    .then((json) => {
	    	//console.log(json["updateTime"]);
	    	json["waitTime"].forEach((item)=>{
	    		//console.log(item.hospName+" "+ item.topWait.match(/\d+/)[0]+"\n");		
			var conditions = { name: item.hospName };
			Place.findOne( conditions, function( err, place ) {
			if (err) return handleError(err);
			if (place != null) {
					place.waitTime = Number(item.topWait.match(/\d+/)[0]);
					place.updateTime = 1;
					place.save();
				}
			})
	    		
	    	});
		   res.send("Update successfully!");
		});
});

//test adding comment under places 
app.get('/comment', function(req,res) {
	//hardcode p here, may parse from body later
	let p = "Alice Ho Miu Ling Nethersole Hospital"
	Comment.create({
		author: "WEI",
		content: "This Hospital is awesome!"
	},function (err, comment) {
		if (err) return handleError(err);
		//update related place
		Place.findOne({name: p}, function(err, place) {
			if (err) return handleError(err);
			if (place != null) {
					place.comment.push(comment);
					place.save();
				}
		});
		res.send("Add comment successfully!");
	})
});
//The above function can be modified to update favorite place too


//CRUD place data

//Create place data
app.post('/admin/addplace', function(req, res){
	if (req.body.name == ""){
		res.send("name cannot be empty.");
	} else if (req.body.longitude == "") {
		res.send("longitude cannot be empty.");
	} else if (req.body.latitude == "") {
		res.send("Latitude cannot be empty.");
	} else if (req.body.waitTime == "") {
		res.send("waiting Time cannot be empty.");
	}
	else{
		var new_place = new Place({
			name: req.body.name,
			latitude: req.body.latitude,
			longitude: req.body.longitude,
			waitTime: req.body.waitTime,
			updateTime: req.body.updateTime
		});
		new_place.save(function(err)
		{
			if(err){
				console.log("new place cannot save, err: "+err);
			}
			else{
				res.status(201).send("new place created");
			}
		});
	}
});

//read place data
app.get('/admin/place', function(req, res){
	var str = "Place(s) in the database: <br><br>";
	Place.find().populate("comment").exec(
		function(err, results){
			if (err) { 
				res.send("err: "+ err);
			}
			else if(!results){
				res.send("no place in db now");
			}
			else
			{
				for (var i = 0; i < results.length; i++)
				{
					str +=
					"Place name: " + results[i].name + "<br>" +
					"Place latitude: " + results[i].latitude + "<br>" +
					"Place longitude: " + results[i].longitude + "<br>" +
					"Place waitTime: " + results[i].waitTime + "<br>" +
					"Place updateTime: " + results[i].updateTime + "<br><br>" +
					"Place comment: <br>";
					/*user comment is push*/
					if (results[i].comment != null)
					{
						for (var j = 0; j < results[i].comment.length; j++) 
						{
							str +=
								"Author: " + result[i].comment[j].author + "<br>" +
								"Comment: " + result[i].comment[j].content + "<br>";
						}
					}else{
						str += "NO comment for this place yet. <br>";
					}
					
					str += "<br> <br>";
				}
				res.send(str);
			}
		}
	);
});

//Update the place data
app.post("/admin/update", function(req, res){
	if (req.body.name == "") {
		res.send("name cannot be empty.");
		console.log("empty");
	} else if (req.body.longitude == "") {
		res.send("longitude cannot be empty.")
	} else if (req.body.latitude == "") {
		res.send("Latitude cannot be empty.")
	} else {
	var new_place = new Place({
		name: req.body.name,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		waitTime: req.body.waitTime,
		updateTime: req.body.updateTime
	});
	Place.findOneAndUpdate(
		{ name: req.body.name}, new_place, function(err, Place){
			if (err){
				console.log("update error: "+ err);
			}
			else if (!place){
				res.send(req.body.name + " is not found.");
			}
			else{
				res.send("Update of " + req.boby.name + " success.");
			}
		});
	}
});

//Delete the place data
app.post("/admin/deleteplace", function(req, res){
	Place.findOneAndDelete({name: req.body.name}, function(err, place){
		if (err) {
			console.log("delete error: "+ err);
			res.send("[Error] Fail to delete " + req.body.name);
		}
		else if(!place){
			res.send(req.body.name + " do not exist in db. Cannot delete.");
		}
		else{
			res.send("Delete of " + req.params["placename"] + " success.");
		}
	})
})

//CRUD user data
//name password favorite isAdmin
//Create user data
app.post('/admin/adduser', function (req, res) {
	if (req.body.name == null) {
		res.send("name cannot be empty.");
	}
	else if (req.body.password == null) {
		res.send("password cannot be empty.");
	}
	else {
		User.find({name: req.body.name}, function(err, user){
			if (user.length> 0){
				res.send("User name with "+ req.body.name + "already exist.");
			}
			else{
				var new_user = new User({
					name: req.body.name,
					password: req.body.password,
					favorite: null,
					isAdmin: false
				});
				new_user.save(function (err) {
					if (err) {
						console.log("new user cannot save, err: " + err);
						res.send("Fail to create user. Please enter again!");
					}
					else {
						res.status(201).send("new user created");
					}
				});
			}
		});
		
	}
});
//read users data
//name password favorite comment isAdmin
app.get('/admin/users', function (req, res) {
	var str = "user(s) in the database: <br><br>";
	User.find({isAdmin: false}).populate("Place").exec(
		function (err, results) {
			if (err){res.send(err);}
			else if(results.length )
			if (results.length > 0) {
				for (var i = 0; i < results.length; i++) {
					str +=
						"User name: " + results[i].name + "<br>" +
						"User password: " + results[i].password + "<br>" +
						/* user favorite is places, place name is called */
						"User favorite: " + results[i].favorite.name + "<br>" +
						"User updateTime: " + results[i].updateTime + "<br>"
				}
				res.send(str);
			}
		}
	)
});

//Update the users data
app.post("/admin/updateUser", function (req, res) {
	if(req.body.favorite != null)
	{
		Place.findOne(
			{name: req.body.favorite}, function(err, placeres)
			{
				if(placeres == null){
					console.log("error: no such place in database");
				}
				else{
					//favorite should be push
					var new_user = new User({
						name: req.body.name,
						password: req.body.password,
						favorite: placeres,
						isAdmin: false
					});
					User.findOneAndUpdate(
						{ name: req.body.name }, new_user, function (err, user) {
							if (err) {
								console.log("update error: " + err);
							}
							else if(!user){
								res.send("User "+req.body.name+ " do not exist in db. Cannot update.");
							} else {
								res.send("Update of " + req.boby.name + " success.");
							}
						});
				}
			}
		);
	}else{

		var new_user = new User({
			name: req.body.name,
			password: req.body.password,
			favorite: null,
			isAdmin: false
		});
		User.findOneAndUpdate(
			{ name: req.body.name }, new_user, function (err) {
				if (err) {
					console.log("update error: " + err);
				} else if (!user) {
					res.send("User " + req.body.name + " do not exist in db. Cannot update.");
				}
				else {
					res.send("Update of " + req.boby.name + " success.");
				}
			});
		}
});

//Delete the user data
app.post("/admin/deleteUser", function (req, res) {
	User.findOneAndDelete({ name: req.body.name }, function (err, user) {
		if (err) {
			res.send("delete error: " + err);
		} else if (!user) {
			res.send("User " + req.body.name + " do not exist in db. Cannot delete.");
		}
		else {
			res.send("Delete of " + req.body.name + " success.");
		}
	})
})


// listen to port x
const server = app.listen(2009);

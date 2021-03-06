const express = require('express');
var cors = require('cors')
const app = express();
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
const moment = require("moment");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.json());

var cors = require('cors');
app.use(cors());

const SECRET = "csci2720";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://s1155110790:x37622@localhost/s1155110790');

var db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console,'Connection error:'));
// Upon opening the database successfully
db.once('open', function () {
console.log("Connection is open...");
});

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

var userSchema = Schema({
	id: {type: Number, required:true,unique: true},
	name: { type: String, required: true, unique: true},
	password: { type: String, required: true },//need to fulfill hash later
	favorite: [{type: String}],
	isAdmin: { type: Boolean, required:true}
});

var placeSchema = Schema({
	name: { type: String, required: true, unique: true },
	latitude: { type: Number, required: true },
	longitude: { type: Number, required: true },
	waitTime: { type: Number, required: true },
	SevenDaysTime:[{type:Number}],
	TenHourTime:[{type:Number}],
	updateTime: { type: String, required: true },
	comment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

var commentSchema = Schema({
	author: {type: String, required: true},
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
	//console.log(req.body.username);
	//console.log(req.body.password);
	User.findOne()
	.sort({ id: -1 })
	.exec(function (err,user) {
		if (user === null) {
			User.create({
				id: 1,
				name: req.body.username,
				password: require('bcryptjs').hashSync(req.body.password,10),
				isAdmin: req.body.admin
			}, function (err,userNew) {
				if (err) return handleError(err);
				res.json("welcome first user!");
			})
		}
		else {
			User.find({name:req.body.name}).exec(function(err,response){
				console.log(response);
				if (err){
					res.json(err);
				}else if (response.length == 0){
					User.create({
						id: user.id+1,
						name: req.body.username,
						password: require('bcryptjs').hashSync(req.body.password,10),
						isAdmin: 0
					}, function (err,userNew) {
						if (err){
							res.json("Register Fail");
							return;
						};
						res.json("Register Success");
					})
				}else{
					res.json("The user has already been existed");
				}
			})
		}
	})
})

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
		const token = jwt.sign({???
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

async function fetchSevenDayData(str,hosp){
	var date = []
	var waitTime = []
	var data = []
	// date sort from latest to oldest using library --Moment 
	//the addition of 15 minutes is due to the delay report from the website, url/20210503-1800 record data for 17:45
	for(i = 1 ; i<7;i++){
		date.push(moment(str,"DD/MM/YYYY hh:mmA").subtract(i,'days').add(15,'minutes').format("YYYYMMDD-HHmm"));
	}
	// fail to sort the date in ascending order 
	const promises = date.map(
			id =>fetch("https://api.data.gov.hk/v1/historical-archive/get-file?url=http%3A%2F%2Fwww.ha.org.hk%2Fopendata%2Faed%2Faedwtdata-en.json&time="+id,{method:"get"})
			.then(res=>res.json())
			.then((json)=>{
				json["waitTime"].forEach((item)=>{
					if (item.hospName == hosp){
						data.push(moment(json['updateTime'],"DD/MM/YYYY hh:mmA").format("YYYYMMDD")+":"+Number(item.topWait.match(/\d+/)[0]))
					}
				})
			})
		)
	// Promise all is used to allow parallel fetching
	await Promise.all(promises)
	.then(() =>{
		//stupid way to sort the waitTime by date order see if there are better method
		data = data.sort();
		for (i = 0; i<data.length;i++){
			waitTime.push(data[i].split(":",)[1])
		}
		fetch("http://www.ha.org.hk/opendata/aed/aedwtdata-en.json",{ method: "Get" })
		.then(res => res.json())
	    .then((json) => {
			json["waitTime"].forEach((item)=>{
				if (item.hospName == hosp){
					waitTime.push(Number(item.topWait.match(/\d+/)[0]))
				}
			})
			var conditions = { name: hosp };
			Place.findOne( conditions, function( err, place ) {
			if (err) return handleError(err);
				if (place != null) {
					place.SevenDaysTime = waitTime;
					place.save();
				}
			}
		)}
	)}
)}

async function fetchTenHourData(str,hosp){
	var date = []
	var waitTime = []
	var data = []
	// date sort from latest to oldest using library --Moment 
	//the addition of 15 minutes is due to the delay report from the website, url/20210503-1800 record data for 17:45
	for(i = 1 ; i<10;i++){
		date.push(moment(str,"DD/MM/YYYY hh:mmA").subtract(i,'hours').add(15,'minutes').format("YYYYMMDD-HHmm"));
	}

	// fail to sort the date in ascending order 
	const promises = date.map(
			id =>fetch("https://api.data.gov.hk/v1/historical-archive/get-file?url=http%3A%2F%2Fwww.ha.org.hk%2Fopendata%2Faed%2Faedwtdata-en.json&time="+id,{method:"Get"})
			.then(res=>res.json())
			.then((json)=>{
				json["waitTime"].forEach((item)=>{
					if (item.hospName == hosp){
						data.push(moment(json['updateTime'],"DD/MM/YYYY hh:mmA").format("YYYYMMDD-HHmm")+":"+Number(item.topWait.match(/\d+/)[0]))
					}
				})
			})
	)
	// Promise all is used to allow parallel fetching
	await Promise.all(promises)
	.then(() =>{
		//stupid way to sort the waitTime by date order see if there are better method
		data = data.sort();
		for (i = 0; i<data.length;i++){
			waitTime.push(data[i].split(":",)[1])
		}
		
		fetch("http://www.ha.org.hk/opendata/aed/aedwtdata-en.json",{ method: "Get" })
		.then(res => res.json())
	    .then((json) => {
			json["waitTime"].forEach((item)=>{
				if (item.hospName == hosp){
					waitTime.push(Number(item.topWait.match(/\d+/)[0]))
				}
			})
			var conditions = { name: hosp };
			Place.findOne( conditions, function( err, place ) {
			if (err) return handleError(err);
				if (place != null) {
					place.TenHourTime = waitTime;
					place.save();
			}
			}
		)}
	)}
)}

async function fetchPastData(str,hosp){
	await fetchSevenDayData(str,hosp);
	await fetchTenHourData(str,hosp);
}
app.get("/testing",function(req,res){
	fetch("https://api.data.gov.hk/v1/historical-archive/get-file?url=http%3A%2F%2Fwww.ha.org.hk%2Fopendata%2Faed%2Faedwtdata-en.json&time=20210507-0000",{method:"get"})
	.then(res =>res.json())
	.then((json)=>{
		console.log(json);
	})
})
//load the data from hospAPI and store them in database at the first time
app.get('/init', function(req,res) {
	let hospAPI = "http://www.ha.org.hk/opendata/aed/aedwtdata-en.json";
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
	    			updateTime: json["updateTime"]
	    		},function (err, place) {
	    			if (err) {console.log(err); return;}
					else{
						fetchPastData(json["updateTime"],item.hospName);
					}
	    		})
	    	});
			res.send("Init successfully!");
		});
});

//reload and update the data stored in database after first time
app.get('/update', authAdmin, function(req,res) {
	let hospAPI = "http://www.ha.org.hk/opendata/aed/aedwtdata-en.json";
	let settings = { method: "Get" };

	fetch(hospAPI, settings)
	    .then(res => res.json())
	    .then((json) => {
	    	json["waitTime"].forEach((item)=>{		
			var conditions = { name: item.hospName };
			Place.findOne( conditions, function( err, place ) {
			if (err) return handleError(err);
			else if (!place){
				Place.create({
	    			name:item.hospName,
	    			latitude: gps_dictionary[item.hospName][0],
	    			longitude: gps_dictionary[item.hospName][1],
	    			waitTime: Number(item.topWait.match(/\d+/)[0]),
	    			updateTime: json["updateTime"]
	    		})
			}
			else if (place != null) {
					place.waitTime = Number(item.topWait.match(/\d+/)[0]);
					place.updateTime = json["updateTime"];
					place.latitude = gps_dictionary[item.hospName][0];
					place.longitude = gps_dictionary[item.hospName][1];
					place.save();
				}
			fetchPastData(json["updateTime"],item.hospName);
			})
	    		
	    	});
		   
		}).then(()=>{
		});
		res.json("Update successfully!");
});

//getting data for particular hospital
app.get("/page/:name",function(req,res){
	let hosp = req.params["name"]
	Place.findOne({name:hosp}).populate('comment').exec(
		function(err,e){
			if(err){
				res.send("Fail");
				return;
			}else if (!e){
				res.send("No Result");
				return;
			}else{
				res.json(e);
				return;
			}
		}	
	)
})

//fetch the data from database to frontend
//also for searching in form of /loaddata?field=XXXXX?searchItem=XXXXX
app.get("/loaddata" ,authUser, function(req,res){
	let searchQuery = {};
	if (req.query["field"]&&req.query["searchItem"])
		searchQuery[req.query["field"]] = req.query["searchItem"];
	Place.find(searchQuery,"name longitude latitude waitTime updateTime").exec(
		function(err,e){
			if (err){
				res.send("Fail to fetch data from database!");
			}
			else{
				res.json(e);
			}
		}
	)
})
/*
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
*/

//CRUD place data

//Create place data
app.post('/admin/addplace', authAdmin, function(req, res){
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
			updateTime: moment().format("DD/MM/YYYY hh:mmA")
		});
		new_place.save(function(err)
		{
			if(err){
				console.log("new place cannot save, err: "+err);
				res.send("Fail to create new place");
			}
			else{
				res.status(201).send("new place created");
			}
		});
	}
});

//read place data
app.get('/admin/place', authAdmin, function(req, res){
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
					console.log(results[i]);
					str +=
					"Name: " + results[i].name + "<br>" +
					"Latitude: " + results[i].latitude + "<br>" +
					"Longitude: " + results[i].longitude + "<br>" +
					"Current waitTime: " + results[i].waitTime + "<br>" +
					"Last 7 days waiting Time: [" + results[i].SevenDaysTime + "]<br>"+
					"Last 10 hours waiting Time: [" + results[i].TenHourTime + "]<br>" + 
					"Place updateTime: " + results[i].updateTime + "<br><br>" +
					"Place comment: <br>";
					/*user comment is push*/
					if (results[i].comment.length !=0)
					{
						for (var j = 0; j < results[i].comment.length; j++) 
						{
							str +=
								"	Author: " + results[i].comment[j].author + "<br>" +
								"	Comment: " + results[i].comment[j].content + "<br>";
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
app.post("/admin/update", authAdmin, function(req, res){
	if (req.body.name == "") {
		res.send("name cannot be empty.");
		console.log("empty");
	} else if (req.body.longitude == "") {
		res.send("longitude cannot be empty.")
	} else if (req.body.latitude == "") {
		res.send("Latitude cannot be empty.")
	} else {
	var new_place = {
		name: req.body.name,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		waitTime: req.body.waitTime,
		updateTime: moment().format("DD/MM/YYYY hh:mmA")
	};
	Place.findOneAndUpdate(
		{ name: req.body.name}, new_place, function(err, place){
			if (err){
				console.log("update error: "+ err);
				res.send("update error");
			}
			else if (!place){
				res.send(req.body.name + " is not found.");
			}
			else{
				res.send("Update of " + req.body.name + " success.");
			}
		});
	}
});

//Delete the place data
app.post("/admin/deleteplace", authAdmin, function(req, res){
	Place.findOneAndDelete({name: req.body.name}, function(err, place){
		if (err) {
			console.log("delete error: "+ err);
			res.send("[Error] Fail to delete " + req.body.name);
		}
		else if(!place){
			res.send(req.body.name + " do not exist in db. Cannot delete.");
		}
		else{
			res.send("Delete of " + req.body.name + " success.");
		}
	})
})


//CRUD user data
//name password favorite isAdmin
//Create user data
app.post('/admin/adduser', authAdmin, function (req, res) {
	if (req.body.name == null) {
		res.send("name cannot be empty.");
	} 
	else if (req.body.password == null) {
		res.send("password cannot be empty.");
	}
	else {
		User.find({name: req.body.name}, function(err, user){
			if (user.length> 0){
				res.send("User with id"+ req.body.name + "already exist.");
			}
			else{
				User.findOne()
				.sort({ id: -1 })
				.exec(function (err,user2) {
					if (user2 === null) {
						User.create({
							id: 1,
							name: req.body.name,
							password: require('bcryptjs').hashSync(req.body.password,10),
							isAdmin: false
						}, function (err,userNew) {
							if (err) return handleError(err);
							res.send("welcome first user!");
						})
					}
					else {
						User.create({
							id: user2.id+1,
							name: req.body.name,
							password: require('bcryptjs').hashSync(req.body.password,10),
							isAdmin: false
						}, function (err,userNew) {
							if (err) return handleError(err);
							res.send("ok");
						})		
					}
				
				});
			}
		});
		
	}
});
//read users data
//name password favorite comment isAdmin
app.get('/admin/users', authAdmin, function (req, res) {
	var str = "user(s) in the database: <br><br>";
	User.find({isAdmin: false}).exec(
		function (err, results) {
			if (err){res.send(err);}
			else if(results.length )
			console.log(results);
			if (results.length > 0) {
				for (var i = 0; i < results.length; i++) {
					str +=
						"User name: " + results[i].name + "<br>" +
						"User password: " + results[i].password + "<br>";
					if (results[i].favorite.length != 0){
						for (var j = 0; j < results[i].favorite.length; j++){
							str += "User favorite: " + results[i].favorite[j].name + "<br>";
						}
					}
					else{
						str += "NO favorite place for this user.";
					}
					// str += "User updateTime: " + results[i].updateTime + "<br>";
					str += "<br>";
				}
				
				res.send(str);
			}
		}
	)
});

//Update the users data
app.post("/admin/updateUser", authAdmin, function (req, res) {
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
					var new_user = {
						name: req.body.name,
						password: require('bcryptjs').hashSync(req.body.password,10),
						favorite: placeres.name,
						isAdmin: false
					};
					User.findOneAndUpdate(
						{ name: req.body.name }, new_user, function (err, user) {
							if (err) {
								console.log("update error: " + err);
							}
							else if(!user){
								res.send("User "+req.body.name+ " do not exist in db. Cannot update.");
							} else {
								res.send("Update of " + req.body.name + " success.");
							}
						});
				}
			}
		);
	}else{

		var new_user = {
			name: req.body.name,
			password: require('bcryptjs').hashSync(req.body.password,10),
			favorite: [],
			isAdmin: false
		};
		User.findOneAndUpdate(
			{ name: req.body.name }, new_user, function (err,user) {
				if (err) {
					console.log("update error: " + err);
				} else if (!user) {
					res.send("User " + req.body.name + " do not exist in db. Cannot update.");
				}
				else {
					res.send("Update of " + req.body.name + " success.");
				}
			});
		}
});

//Delete the user data
app.post("/admin/deleteUser", authAdmin, function (req, res) {
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

//Client function

//list all place name
app.get("places", function (req, res)
{
	Place.find().exec(
		function(err, places)
		{
			var str = "places: <br>"
			if (places.length == 0){
				res.json("NO place in database");
			}else {
				for (var i = 0; i < places.length; i++)
				{
					str += places[i].name + "<br>";
				}
				res.json(str);
			}
		}
	);
});

//add current place to user's favorite
app.post("/user/addfavorite", function (req, res)
{
	console.log(req.body.place);
	//res.send("Like successfully!");
	
	if (req.body.place != "")
	{
		User.findOne({name: req.body.username}).exec(
			function(err, user)
			{
				if (user == null){
					res.send("no such user");
				}else{
					Place.findOne({name: req.body.place}).exec(
						function(err, place)
						{
							if (place == null){
								res.send("no such place");
							}else{
								user.favorite.push(place.name);
								user.save();
								//console.log("favourite" + user.favorite );
								res.send("Like successfully!");
							}
						}
					);
				}
			}
		);
	}
	
});

app.get("/user/loadfavorite/:name",function(req,res){
	var favplace = []
	User.findOne({ name: req.params.name},"favorite").exec(
		function(err,fav){
			if (err){
				res.send("Fail to find user: " + req.params.name)
			}else{
				console.log(fav.favorite);
				for(i = 0; i <fav.favorite.length;i++){
					favplace.push(fav.favorite[i])
				}
				res.json(favplace);
			}
		}
	)
})
//fetch the comment list from database to frontend
app.get("/loadcomment", function(req,res){
	var commentlist = [];
	Place.findOne({name:req.query["searchItem"]}, "comment").populate("comment").exec(
		function(err,result){
			if (err){
				res.send("Fail to fetch data from database!");
				return;
			}
			else{
				if(result.comment.length != 0)
				{
					for (var i = 0; i < result.comment.length; i++) 
					{
						commentlist.push([result.comment[i].author,result.comment[i].content]);
					}
				}
				res.send(commentlist);
			}	
	})

})

//add new comment to place
app.post("/addComment", function(req, res)
{
	console.log(req.body.place);
	console.log(req.body.comment);
	console.log(req.body.user);

	if (req.body.comment != ""){
		var new_comment = new Comment({
			author: req.body.user,
			content: req.body.comment
		});
		Comment.create(new_comment, function(err, comment){
			if(err) {res.send(err);}
			else{
				Place.findOne({name: req.body.place}).populate("comment").exec(
					function(err, place){
						if (err) { res.send(err); }
						else {
							place.comment.push(comment);
							place.save();
							res.send("Your comment is savad");
						}
					}
				);
			}
		});
	}
});

// listen to port x
const server = app.listen(2049);

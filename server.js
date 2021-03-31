const express = require('express');
const app = express();
const fetch = require('node-fetch');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

gps_dictionary={
	 "Alice Ho Miu Ling Nethersole Hospital":[22.3415,114.1532], 
     "Caritas Medical Centre":[22.3415,114.1532], 
     "Kwong Wah Hospital":[22.3152,114.1724], 
     "North District Hospital":[22.3415,114.1532], 
     "North Lantau Hospital":[22.3415,114.1532], 
     "Princess Margaret Hospital":[22.3415,114.1532], 
     "Pok Oi Hospital":[22.3415,114.1532], 
     "Prince of Wales Hospital":[22.3415,114.1532], 
     "Pamela Youde Nethersole Eastern Hospital":[22.3415,114.1532], 
     "Queen Elizabeth Hospital":[22.3415,114.1532], 
     "Queen Mary Hospital":[22.3415,114.1532], 
     "St John Hospital":[22.3415,114.1532], 
     "Tseung Kwan O Hospital":[22.3415,114.1532], 
     "Tuen Mun Hospital":[22.3415,114.1532], 
     "Tin Shui Wai Hospital":[22.3415,114.1532], 
     "United Christian Hospital":[22.3415,114.1532], 
     "Yan Chai Hospital":[22.3415,114.1532],
     "Ruttonjee Hospital":[22.3415,114.1532]
};

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
	password: { type: String, required: true },//need to fulfill hash later
	favorite: [{ type: Schema.Types.ObjectId, ref: 'Place' }],
	comment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
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
	let hospAPI = "http://www.ha.org.hk/opendata/aed/aedwtdata-en.json";
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





// listen to port x
const server = app.listen(2009);

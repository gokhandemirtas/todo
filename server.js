var express = require('express'),
	http = require('http'),
	bodyParser = require('body-parser'),
	PouchDB = require('pouchdb'),
	db = new PouchDB('database'),
	tdserver = express(),
	tdapi = express(),
	cors = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
	}


 
tdapi.use(bodyParser.json());
tdapi.use(bodyParser.urlencoded({ extended: true }));
tdapi.use(cors);

var routes = require('./routes/routes.js')(tdapi, db),
	tdapi = tdapi.listen(3000, function () {
	
		console.log('API running on: ', 3000);

		tdserver.use(express.static('app'));
		tdserver.listen(3001, function() { 
		  console.log('APP running on: ', 3001);
		});

});
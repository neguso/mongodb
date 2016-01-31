var co = require('co');
var mongoose = require('mongoose');

var models = require('../models');
var config = require('../config.js');


mongoose.connection.once('open', function()
{
	console.log('MongoDB connection opened.');

	require('./attachments').test();
	//require('./entities').test();

});

mongoose.connection.once('close', function()
{
	console.log('MongoDB connection closed.');
});

mongoose.connection.on('error', function(err)
{
	console.log('MongoDB connection error. ' + err);
});

mongoose.connect('mongodb://' + config.mongodb.server +  '/' + config.mongodb.database);

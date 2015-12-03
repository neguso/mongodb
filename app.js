var mongoose = require('mongoose');
var co = require('co');

var config = require('./config');
var models = require('./models');
var services = require('./services/projects');
var test = require('./services/test');


mongoose.connection.once('open', function()
{
	console.log('MongoDB connection opened.');

	test.testConfiguration();
	test.testProject();
});

mongoose.connection.once('close', function()
{
	console.log('MongoDB connection closed.');
});

mongoose.connection.on('error', function()
{
	console.log('MongoDB connection error.');
});

mongoose.connect('mongodb://' + config.mongodb.server +  '/' + config.mongodb.database);
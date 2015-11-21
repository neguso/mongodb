var mongoose = require('mongoose');

var config = require('./config');
var models = require('./models');
var services = require('./services/projects');
var seed = require('./services/seed');


mongoose.connection.on('error', function()
{
	console.log('MongoDB connection error.');
});

mongoose.connection.once('open', function()
{
	console.log('MongoDB connection opened.');

	seed.test();

	services.Projects.read(null);
});

mongoose.connection.once('close', function()
{
	console.log('MongoDB connection closed.');
});

mongoose.connect('mongodb://' + config.mongodb.server +  '/' + config.mongodb.database);



function handleError(err)
{
	console.error(err);
}

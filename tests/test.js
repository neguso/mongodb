var co = require('co');
var mongoose = require('mongoose');

var models = require('../models');
var config = require('../core/configuration')('../config.json');


mongoose.connection.once('open', function()
{
	console.log('MongoDB connection opened.');

	require('./configuration').test();
	require('./attachments').test();
	require('./entities').test();

});

mongoose.connection.once('close', function()
{
	console.log('MongoDB connection closed.');
});

mongoose.connection.on('error', function()
{
	console.log('MongoDB connection error.');
});

config.connect(function() {

	mongoose.connect('mongodb://' + config.get('mongodb/server') +  '/' + config.get('mongodb/database'));

});


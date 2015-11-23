var mongoose = require('mongoose');
var co = require('co');

var config = require('./config');
var models = require('./models');
var services = require('./services/projects');
var test = require('./services/test');


mongoose.connection.on('error', function()
{
	console.log('MongoDB connection error.');
});

mongoose.connection.once('open', function()
{
	console.log('MongoDB connection opened.');

	

	co(function*(){

		yield test.w_co();
		yield test.w_promises();
	});


	return;
	test.project()
		.then(function() {
			services.Projects.read(null)
				.then(function(projects) {

					services.Projects.get(projects[0]._id)
						.then(function(project) {

							;

						});

				});

		},
		function(err) {
			console.log('Test error.');
		});

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

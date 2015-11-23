var mongoose = require('mongoose');
var co = require('co');

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

	var p1 = seed.all();
	var p2 = seed.all2();

	seed.all()
		.then(function(result) {

			services.Projects.read(null)
				.then(function(project) {

					;

				});

		})
		.catch(function(err) {

		});

	return;

	seed.test()
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

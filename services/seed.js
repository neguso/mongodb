var Q = require('q');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var mongoose = require('mongoose');
var models = require('../models');


exports.test = function()
{
	models.Project.find().remove({}, function(err, data) {
		if(err) return;

		console.log('All Projects removed.');

		testProject();
	});
};

function testProject()
{
	// create a project with containers and tags
	var document = {
		name: 'Magic Project',
		description: 'this is a magic project',
		containers: [
			{ name: 'Backlog', description: 'Backlog container' },
			{ name: 'Sprint One', description: 'Sprint one container' }
		],
		tags: [
			{ name: 'red', color: 'red' },
			{ name: 'blue', color: 'blue' }
		]
	};
	models.Project.create(document)
		.then(function(project) {
			console.log('Project created - ' + project.id);

			// next
			testContainers1();
		}, function(err) {
			console.log('Error creating project - ' + err);
		});
}

function testContainers1()
{
	// create a new container
	var project = models.Project.find({}, null, { take: 1 }).exec()
		.then(function(result){
			project = result[0];

			project.containers.addToSet({ name: 'new container', description: 'container added later' });
			project.save().then(function() {
				console.log('Project container added - ' + project.id);

				// next
				testContainers2();
			}, function(err) {
				console.log('Error saving project - ' + err);
			});

		}, function(err){
			console.log('Error finding projects - ' + err);
		});
}

function testContainers2()
{
	// update an existing container
	var project = models.Project.find({}, null, { take: 1 }).exec()
		.then(function(result){
			project = result[0];

			var container = project.containers[0];
			container.name = 'updated container';
			container.description = 'updated description for container';

			project.save().then(function() {
				console.log('Project container updated - ' + project.id);

				// next
				testContainers3();
			}, function(err) {
				console.log('Error saving project - ' + err);
			});

		}, function(err){
			console.log('Error finding projects - ' + err);
		});
}


function testContainers3()
{
	// remove an existing container
	var project = models.Project.find({}, null, { take: 1 }).exec()
		.then(function(result){
			project = result[0];

			project.containers[1].remove();

			project.save().then(function() {
				console.log('Project container updated - ' + project.id);

			}, function(err) {
				console.log('Error saving project - ' + err);
			});

		}, function(err){
			console.log('Error finding projects - ' + err);
		});
}



exports.all = function()
{
  console.log('seeding projects...');
  seed_projects()
    .then(function(result) { console.log('done'); })
    .catch(function(reason) { console.log('error:' + reason); });



};


var seed_projects = async(function()
{
  var project = {
    count: Q.nbind(models.Project.count, models.Project),
    create: Q.nbind(models.Project.create, models.Project)
  };

	var count = await(project.count({}));
	if(count === 0)
	{
		for(var batch = 0; batch < 10; batch++)
		{
			var ary = [];
			for(var i = 0; i < 1000; i++)
			{
				var n = (batch * 1000 + i).toString();
				ary.push({
					name: 'project name ' + n,
					description: 'project ' + n + ' description goes here',
					containers: [{ name: 'todo' }, { name: 'done' }]
				});
			}
			await(project.create(ary));
		}
  }
});

var query_projects = async(function(){
	var project = {
		find: Q.nbind(models.Project.find, models.Project),
		create: Q.nbind(models.Project.create, models.Project)
	};

	// project users
	var result = await(projects.find({ name: 'project name 12345' }));

});


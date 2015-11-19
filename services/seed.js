var Q = require('q');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var mongoose = require('mongoose');
var models = require('../models');


exports.test = function()
{
	models.Project.find().remove({}, function(err, data) {
		if(err) return;

		console.log('Removed.');

		createProject();
	});
};

function createProject()
{
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
			console.log('Saved - ' + project.id);

			createTasks();
		}, function(err) {
			console.log('Error - ' + err);
		});
}

function createTasks()
{
	var documents = [
		{  }
	];

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


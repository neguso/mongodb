var Q = require('q');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var mongoose = require('mongoose');
var models = require('../models');


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


var q = require('q');
var mongoose = require('mongoose');
var models = require('../models');
var co = require('co');


exports.test = function()
{
	var defer = q.defer();

	models.Project.find().remove({}, function(err, data) {
		if(err) return defer.reject(err);

		console.log('All Projects removed.');

		testProject()
			.then(function(result) {
				defer.resolve(result);
			}, function(err) {
				defer.reject(err);
			});
	});

	return defer.promise;
};

function testProject()
{
	var defer = q.defer();

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
			testContainers1()
				.then(function(result) {
					defer.resolve(result);
				}, function(err) {
					defer.reject(err);
				});
		}, function(err) {
			console.log('Error creating project - ' + err);
			defer.reject(err);
		});

	return defer.promise;
}

function testContainers1()
{
	var defer = q.defer();

	// create a new container
	var project = models.Project.find({}, null, { take: 1 }).exec()
		.then(function(result){
			project = result[0];

			project.containers.addToSet({ name: 'new container', description: 'container added later' });
			project.save().then(function() {
				console.log('Project container added - ' + project.id);

				// next
				testContainers2()
					.then(function(result) {
						defer.resolve(result);
					}, function(err) {
						defer.reject(err);
					});
			}, function(err) {
				console.log('Error saving project - ' + err);
				defer.reject(err);
			});

		}, function(err){
			console.log('Error finding projects - ' + err);
			defer.reject(err);
		});

	return defer.promise;
}

function testContainers2()
{
	var defer = q.defer();

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
				testContainers3()
					.then(function(result) {
						defer.resolve(result);
					}, function(err) {
						defer.reject(err);
					});
			}, function(err) {
				console.log('Error saving project - ' + err);
				defer.reject(err);
			});

		}, function(err){
			console.log('Error finding projects - ' + err);
			defer.reject(err);
		});

	return defer.promise;
}

function testContainers3()
{
	var defer = q.defer();

	// remove an existing container
	var project = models.Project.find({}, null, { take: 1 }).exec()
		.then(function(result){
			project = result[0];

			project.containers[1].remove();

			project.save().then(function() {
				console.log('Project container removed - ' + project.id);
				defer.resolve();
			}, function(err) {
				console.log('Error saving project - ' + err);
				defer.reject(err);
			});

		}, function(err){
			console.log('Error finding projects - ' + err);
			defer.reject(err);
		});

	return defer.promise;
}



exports.all = co.wrap(function*() {

	try {
		console.log('seeding users...');
		yield seed_users();

		console.log('seeding projects...');
		yield seed_projects();

		//...

		console.log('done');
		return true;
	}
	catch (err) {
		console.log('error: ' + err);
		return err;
	}

});

exports.all2 = function() {
	return co(function*(){

		try {
			console.log('seeding users...');
			yield seed_users();

			console.log('seeding projects...');
			yield seed_projects();

			//...

			console.log('done');
			return true;
		}
		catch (err) {
			console.log('error: ' + err);
			return err;
		}

	});
};


var seed_users = co.wrap(function*() {
	var count = yield models.User.count();
	if(count === 0)
	{
		var user = yield models.User.create({ email: 'test@domain.com', firstName: 'Jon', lastName: 'Doe' });
	}
});

var seed_projects = co.wrap(function*() {

	var count = yield models.Project.count({});
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
			yield models.Project.create(ary);
		}
	}
});
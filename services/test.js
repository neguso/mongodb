var q = require('q');
var co = require('co');

var mongoose = require('mongoose');
var models = require('../models');


exports.w_promises = function()
{
	models.Project.count({})
		.then(function(count){

			if(count === 0)
				return models.Project.create({ mame: 'the project' });

			return Promise.resolve(true);
		})
		.then(function(project){

			return models.Project.find({}, null, { take: 1 }).exec();
		})
		.then(function(projects){

			projects[0].containers.addToSet({ name: 'new container' });
			return projects[0].save();
		})
		.then(function(project){

			var p = project;
		});
};


exports.w_co = function()
{
	return co(function*(){

		var count = yield models.Project.count({});
		if(count === 0)
			yield models.Project.create({ mame: 'the project' });
		var projects = yield models.Project.find({}, null, { take: 1 }).exec()
		projects[0].containers.addToSet({ name: 'new container' })
		var project = yield projects[0].save();

	});

};



exports.project = function()
{
	return new Promise(function(resolve, reject){

		// cleanup projects
		models.Project.find().remove({}, function(err, data) {
			if(err) return reject(err);

			console.log('All Projects removed.');

			testProjectCreate()
				.then(function(result) {
					resolve(result);
				}, function(err) {
					reject(err);
				});
		});

	});
};

function testProjectCreate()
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
			testProjectContainersAdd()
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

function testProjectContainersAdd()
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
				testProjectContainersUpdate()
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

function testProjectContainersUpdate()
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
				testProjectContainersRemove()
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

function testProjectContainersRemove()
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

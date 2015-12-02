var q = require('q');
var co = require('co');
var mongoose = require('mongoose');

var models = require('../models');
var service = require('../services/projects');


exports.testProject = co.wrap(function*() {

	try {

		// clear projects
		yield models.User.find({}).remove().exec();
		yield models.Project.find({}).remove().exec();
		yield models.ProjectUserLink.find({}).remove().exec();

		// create a user
		var user = yield models.User.create({
			email: 'john@domain.com',
			first: 'John',
			last: 'Doe'
		});

		// create a project with containers and tags
		var project = yield models.Project.create({
			name: 'Magic Project',
			description: 'this is a magic project',
			containers: [
				{name: 'Backlog', description: 'Backlog container'},
				{name: 'Sprint One', description: 'Sprint one container'}
			],
			tags: [
				{name: 'red', color: 'red'},
				{name: 'blue', color: 'blue'}
			],
			files: [
				{ name: 'image.jpeg', size: 1234, key: 'qwerty' },
				{ name: 'picture.png', size: 4321, key: 'ytrewq' }
			]
		});

		// assign user to project
		yield models.ProjectUserLink.create({
			role: 'default',
			user: user._id,
			project: project._id
		});


		var l = yield service.Projects.read(user._id);
		var ll = yield models.Project.read(user._id);
		var p = yield service.Projects.get(project._id);

		p.name = 'new project name';
		service.Projects.update(p);

		service.Projects.remove(p._id);



		var e = 0;
	}
	catch(err)
	{
		console.log('error: ' + err);
	}
});



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

var assert = require('assert'),
		co = require('co'),
		mongoose = require('mongoose'),
		fs = require('fs');

var models = require('../models');
var attachments = require('../core/attachments')('files');

exports.test = co.wrap(function*() {

	try {

		setInterval(function() {
			create_user(function(err, user) {
				assert.ifError(err);
			});
		}, 200);

		setInterval(function() {
			create_project(function(err, user) {
				assert.ifError(err);
			});
		}, 30);
		setInterval(function() {
			create_container(function(err, container) {
				assert.ifError(err);
			});
			create_tag(function(err, container) {
				assert.ifError(err);
			});
		}, 15);
		fs.readFile('sample.jpg', (err, data) => {
			setInterval(function() {
				create_project_file(data, 'jpg', (err) => {
					assert.ifError(err);
				});
			}, 500);
		});

		setInterval(function() {
			assign_usertoproject(function(err, user) {
				assert.ifError(err);
			});
		}, 100);

		setInterval(function() {
			create_task(function(err, task) {
				assert.ifError(err);
			});
		}, 10);

		var e = 0;
	}
	catch(err)
	{
		console.log('error: ' + err);
	}
});



function create_user(cb)
{
	models.User.create({
		email: srnd(10, 20) + '@' + srnd(8, 16) + '.' + srnd(3),
		first: srnd(8, 16),
		last: srnd(8, 16)
	}, cb);
}

function get_user(cb)
{
	models.User.count({}, function(err, count) {
		assert.ifError(err);
		models.User.findOne({}).setOptions({ skip: Math.floor(Math.random() * count) }).exec(function(err, user) {
			assert.ifError(err);
			if(user !== null)
				cb(null, user);
		});
	});
}

function create_project(cb)
{
	models.Project.create({
		name: srnd(10, 50),
		description: srnd(10, 100)
	}, cb);
}

function get_project(cb)
{
	models.Project.count({}, function(err, count) {
		assert.ifError(err);
		models.Project.findOne({}).setOptions({ skip: Math.floor(Math.random() * count) }).exec(function(err, project) {
			assert.ifError(err);
			if(project !== null)
				cb(null, project);
		});
	});
}

function assign_usertoproject(cb)
{
	get_project((err, project) => {
		assert.ifError(err);
		get_user((err, user) => {
			assert.ifError(err);
			project.assign(user.id, ['default', 'admin'][Math.floor(Math.random() * 2)], cb);
		});
	});
}

function create_container(cb)
{
	get_project((err, project) => {
		assert.ifError(err);
		if(project.containers.length < 50)
		{
			var parent = project.containers[Math.floor(Math.random() * project.containers.length)];

			project.containers.push({
				name: srnd(10, 50),
				description: srnd(10, 100),
				container: (Math.random() > 0.5 ? parent : null)
			});
			project.save(cb);
		}
		else
			cb(null, null);
	});
}

function create_tag(cb)
{
	get_project((err, project) => {
		assert.ifError(err);
		if(project.tags.length < 50)
		{
			project.tags.push({
				name: srnd(10, 50),
				color: srnd(5, 15)
			});
			project.save(cb);
		}
		else
			cb(null, null);
	});
}

function create_project_file(data, type, cb)
{
	get_project((err, project) => {
		assert.ifError(err);
		if(project.files.length < 50)
		{
			attachments.store(data, type, (err, key) => {
				assert.ifError(err);

				project.files.push({
					name: srnd(10, 20),
					size: data.length,
					key: key
				});
				project.save(cb);
			});
		}
		else
			cb(null, null);
	});
}

function get_task(project, cb)
{
	models.Task.count({}, function(err, count) {
		assert.ifError(err);
		models.Task.findOne({ project: project.id }).setOptions({ skip: Math.floor(Math.random() * count) }).exec(function(err, task) {
			assert.ifError(err);
			cb(null, task);
		});
	});
}

function create_task(cb)
{
	var start = new Date(); start.setDate(Math.floor(Math.random() * 60));
	var due = new Date(); due.setDate(start.getDate() + Math.floor(Math.random() * 30));
	get_project((err, project) => {
		assert.ifError(err);

		get_task(project, (err, task) => {
			assert.ifError(err);
			if(Math.random() > 0.5)
				task = null;
			models.Task.create({
				name: srnd(10, 50),
				description: srnd(10, 100),
				start: start,
				due: due,
				project: project.id,
				task: (task === null ? null : task.id),
			}, cb);
		});
	});
}



function srnd(min, max)
{
	max = max || 10;
	min = min || max;
	var n = min + Math.floor(Math.random() * (max - min));
	var ary = new Array(n);
	var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	for(var i = 0; i < n; i++)
		ary[i] = chars.charAt(Math.floor(Math.random() * chars.length));
	return ary.join('');
}


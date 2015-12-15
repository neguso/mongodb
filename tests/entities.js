var assert = require('assert'),
		co = require('co'),
		mongoose = require('mongoose'),
		fs = require('fs');

var models = require('../models');
var attachments = require('../core/attachments')('files');


exports.test = function()
{
	var timers = [];

	timers.push(setInterval(function() {
		create_user(function(err, user) {
			assert.ifError(err);
		});
	}, 200));

	timers.push(setInterval(function() {
		create_project(function(err, user) {
			assert.ifError(err);
		});
	}, 30));
	timers.push(setInterval(function() {
		create_container(function(err, container) {
			assert.ifError(err);
		});
		create_tag(function(err, container) {
			assert.ifError(err);
		});
	}, 15));
	fs.readFile('sample.jpg', (err, data) => {
		timers.push(setInterval(function() {
			create_project_file(data, 'jpg', (err) => {
				assert.ifError(err);
			});
		}, 500));
	});

	timers.push(setInterval(function() {
		assign_usertoproject(function(err, user) {
			assert.ifError(err);
		});
	}, 100));

	timers.push(setInterval(function() {
		create_task(function(err, task) {
			assert.ifError(err);
		});
	}, 10));

	timers.push(setInterval(function() {
		task_change_container(function(err, task) {
			assert.ifError(err);
		});
		task_set_tag(function(err, task) {
			assert.ifError(err);
		});
	}, 50));
	timers.push(setInterval(function() {
		task_assign_user(function(err, task) {
			assert.ifError(err);
		});
	}, 100));

	setTimeout(() => {
		console.log('stopping timers');
		while(timers.length > 0)
			clearInterval(timers.pop());
	}, 1 * 60)
};



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
		if(err) return cb(err, null);
		models.User.findOne({}).setOptions({ skip: Math.floor(Math.random() * count) }).exec(function(err, user) {
			if(err) return cb(err, null);
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
		if(err) return cb(err, null);
		models.Project.findOne({}).setOptions({ skip: Math.floor(Math.random() * count) }).exec(function(err, project) {
			if(err) return cb(err, null);
			cb(null, project);
		});
	});
}

function assign_usertoproject(cb)
{
	get_project((err, project) => {
		if(err) return cb(err, null);
		if(project === null) return cb(null, null);
		get_user((err, user) => {
			if(err) return cb(err, null);
			if(user === null) return cb(null, null);
			models.ProjectUserLink.count({ project: project.id, user: user.id }, (err, count) => {
				if(count === 0)
					project.assign(user.id, ['default', 'admin'][Math.floor(Math.random() * 2)], cb);
				else
					cb(null, null);
			});
		});
	});
}

function create_container(cb)
{
	get_project((err, project) => {
		if(err) return cb(err, null);
		if(project === null) return cb(null, null);
		if(project.containers.length > 50) return cb(null, null);
		var parent = project.containers[Math.floor(Math.random() * project.containers.length)];
		project.containers.push({
			name: srnd(10, 50),
			description: srnd(10, 100),
			container: (Math.random() > 0.5 ? parent : null)
		});
		project.save(cb);
	});
}

function create_tag(cb)
{
	get_project((err, project) => {
		if(err) return cb(err, null);
		if(project === null) return cb(null, null);
		if(project.tags.length > 50) return cb(null, null);
		project.tags.push({
			name: srnd(10, 50),
			color: srnd(5, 15)
		});
		project.save(cb);
	});
}

function create_project_file(data, type, cb)
{
	get_project((err, project) => {
		if(err) return cb(err, null);
		if(project === null) return cb(null, null);
		if(project.files.length > 50) return cb(null, null);
		attachments.store(data, type, (err, key) => {
			if(err) return cb(err, null);
			project.files.push({
				name: srnd(10, 20),
				size: data.length,
				key: key
			});
			project.save(cb);
		});
	});
}

function get_task(project, cb)
{
	models.Task.count({}, function(err, count) {
		if(err) return cb(err, null);
		models.Task.findOne({ project: project.id }).setOptions({ skip: Math.floor(Math.random() * count) }).exec(function(err, task) {
			if(err) return cb(err, null);
			cb(null, task);
		});
	});
}

function create_task(cb)
{
	var start = new Date(); start.setDate(Math.floor(Math.random() * 60));
	var due = new Date(); due.setDate(start.getDate() + Math.floor(Math.random() * 30));
	get_project((err, project) => {
		if(err) return cb(err, null);
		if(project === null) return cb(null, null);
		get_task(project, (err, parent_task) => {
			if(err) return cb(err, null);
			if(Math.random() > 0.75) parent_task = null;
			models.Task.create({
				name: srnd(10, 50),
				description: srnd(10, 100),
				start: start,
				due: due,
				project: project.id,
				task: (parent_task === null ? null : parent_task.id),
			}, cb);
		});
	});
}

function task_change_container(cb)
{
	get_project((err, project) => {
		if(err) return cb(err, null);
		if(project === null) return cb(null, null);
		get_task(project, (err, task) => {
			if(err) return cb(err, null);
			if(task === null) return cb(null, null);
			task.container = project.containers[Math.floor(Math.random() * project.containers.length)].id;
			task.save(cb);
		});
	});
}

function task_set_tag(cb)
{
	get_project((err, project) => {
		if(err) return cb(err, null);
		if(project === null) return cb(null, null);
		get_task(project, (err, task) => {
			if(err) return cb(err, null);
			if(task === null || task.tags.length > 10) return cb(null, null);
			var tag = project.tags[Math.floor(Math.random() * project.tags.length)].id;
			if(task.tags.indedxOf(tag) === -1)
			{
				task.tags.push(tag);
				task.save(cb);
			}
			else
				cb(null, null);
		});
	});
}

function task_assign_user(cb)
{
	get_project((err, project) => {
		if(err) return cb(err, null);
		if(project === null) return cb(null, err);
		get_task(project, (err, task) => {
			if(err) return cb(err, null);
			if(task === null || task.users.length > 10) return cb(err, null);
			get_user((err, user) => {
				if(err) return cb(err, null);
				if(user === null) return cb(null, err);
				if(task.users.indexOf(user.id) === -1)
				{
					task.users.push(user.id);
					task.save(cb);
				}
				else
					cb(null, null);
			});
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


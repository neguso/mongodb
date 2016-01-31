exports.test = function() {
	store_create_file();
	load_loads_file();
	load_file_missing();
	//rest_loads_file();
};

var assert = require('assert');
var fs = require('fs'),
		path = require('path');

var attachments = require('../core/attachments')('files');

function store_create_file() {
	attachments.store('data', 'txt', function(err, key) {
		assert(err === null, 'store() should not return error');

		assert(fs.existsSync('./files/' + key), 'store() should create file');
		assert(fs.readFileSync('./files/' + key, 'utf8') === 'data', 'store() should store correct data');
	});
}

function load_loads_file() {
	attachments.store('data', 'txt', function(err, key) {

		attachments.load(key, 'utf8', function(err, data) {
			assert(err === null, 'load() should not return error');

			assert(data === 'data', 'load() should load correct data');
		});
	});
}

function load_file_missing() {
	attachments.load('missing_file', 'utf8', function(err, data) {
		assert(err === null, 'load() should not return error');

		assert(data === null, 'load() should return null');
	});
}

function rest_loads_file() {
	attachments.store('some data', 'txt', function(err, key) {
		assert(err === null, 'store() should not return error');

		attachments.listen(8080, function() {

			var restify = require('restify');
			var client = restify.createJsonClient('http://localhost:8080');

			client.get('/' + path.basename(key, '.txt') + '/file.txt', function(err, req, res, obj) {
				assert(err === null, 'http get should not return error');

				assert(res.body === 'some data', ' httpget should return file content');

				console.log('stopping listening');
				attachments.close(function(err) {
					console.log('stopped listening');
				});
			});
		});
	});
}

exports.test = function() {
	store_create_file();
	load_loads_file();
	load_file_missing();
	listen();
};

var assert = require('assert');
var fs = require('fs');

var attachments = require('../core/attachments')('files');

function store_create_file()
{
	attachments.store('data', 'txt', function(err, key) {
		assert(err === null, 'store() should not return error');

		assert(fs.existsSync('./files/' + key), 'store() should create file');
		assert(fs.readFileSync('./files/' + key, 'utf8') === 'data', 'store() should store correct data');
	});
}

function load_loads_file()
{
	attachments.store('data', 'txt', function(err, key) {

		attachments.load(key, 'utf8', function(err, data) {
			assert(err === null, 'load() should not return error');

			assert(data === 'data', 'load() should load correct data');
		});
	});
}

function load_file_missing()
{
	attachments.load('missing_file', 'utf8', function(err, data) {
		assert(err === null, 'load() should not return error');

		assert(data === null, 'load() should return null');
	});
}

function listen()
{
	attachments.listen(8080, function() {

		console.log('start listening on 8080');

	});


}
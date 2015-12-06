exports.test = function() {
	connect_ok_when_nofile();
	connect_error_when_invalidfile();
	connect_loads_values();
	json_returns_ok();
	save_values_ok();
	get_returns_undefined_value();
	get_returns_default_value();
	set_undefined_value();
	set_existing_value();
	get_returns_value();
	set_undefined_deep_property();
	set_existing_deep_property();
	set_intermediate_property();
	watch_raise_when_adding_values();
	watch_raise_when_updating_values();
	watch_notraise_when_settingthesame_values();
	watch_notraise_when_saving_values();
	watch_raise_when_file_changes();
};

var assert = require('assert');

function connect_ok_when_nofile()
{
	var config = require('../core/configuration')('missing.json');
	config.connect(function(err) {
		assert(err === null, 'connect() should not return error when file not found');
	});
}

function connect_error_when_invalidfile()
{
	var config = require('../core/configuration')('invalid.json');
	config.connect(function(err) {
		assert(err !== null, 'connect() should return error when file format is invalid');
	});
}

function connect_loads_values()
{
	var config = require('../core/configuration')('config.json');
	config.connect(function(err) {
		assert(config.get('property') === 'flat', 'connect() should load correct root values');
		assert(config.get('object1/object2/property') === 'deep', 'connect() should load correct deep values');
	});
}

function json_returns_ok()
{
	var config = require('../core/configuration')('config.json');
	var json = config.json();
	assert(json === '{}', 'read() should return correct value');
	config.set('property', 'value');
	config.set('number', 100);
	json = config.json();
	assert(json === '{"property":"value","number":100}', 'read() should return correct value');
}

function save_values_ok()
{
	var fs = require('fs');
	fs.unlink('new.json', function(err) {

		var config = require('../core/configuration')('new.json');
		config.set('property', 'value');
		config.save(function(err) {
			assert(err === null, 'save() should not return error');

			var reconfig = require('../core/configuration')('new.json');
			reconfig.connect(function(err) {
				assert(reconfig.json() === '{"property":"value"}', 'save() should save correct values');
			});
		});

	});
}

function get_returns_undefined_value()
{
	var config = require('../core/configuration')('config.json');
	var v = config.get('undefinedvalue1');
	assert(typeof v === 'undefined', 'get() should return undefined value');
}

function get_returns_default_value()
{
	var config = require('../core/configuration')('config.json');
	var v = config.get('undefinedvalue2', 'default');
	assert(v === 'default', 'get() should return default value');
}

function set_undefined_value()
{
	var config = require('../core/configuration')('config.json');
	config.set('value1', 'test');
	assert(config.get('value1') === 'test', 'set() should set value');
}

function set_existing_value()
{
	var config = require('../core/configuration')('config.json');
	config.set('value1', 'initial value');
	config.set('value1', 'test');
	assert(config.get('value1') === 'test', 'set() should set value');
}

function get_returns_value()
{
	var config = require('../core/configuration')('config.json');
	config.set('value2', 'test');
	assert(config.get('value2') === 'test', 'get() should return current value');
	assert(config.get('value2', 'default') === 'test', 'get() should return current value');
}

function set_undefined_deep_property()
{
	var config = require('../core/configuration')('config.json');
	config.set('folder1/value', 'test');
	assert(config.get('folder1/value') === 'test', 'set() should set value');
	config.set('folder1/folder11/folder111/value', 'test');
	assert(config.get('folder1/folder11/folder111/value') === 'test', 'set() should set value');
}

function set_existing_deep_property()
{
	var config = require('../core/configuration')('config.json');
	config.set('folder2/value', 'initial value');
	config.set('folder2/value', 'test');
	assert(config.get('folder2/value') === 'test', 'set() should set value');
}

function set_intermediate_property()
{
	var config = require('../core/configuration')('config.json');
	config.set('folder3/folder31/value', 'test');
	config.set('folder3/value', 'intermediate');
	assert(config.get('folder3/value') === 'intermediate', 'set() should set value');
	assert(config.get('folder3/folder31/value') === 'test', 'deeper set() should not affect intermediate values');
}

function watch_raise_when_adding_values()
{
	var config = require('../core/configuration')('config.json');
	config.connect(function(err) {
		if(err)
			throw new Error('error loading config.json file');

		var called = false;
		config.watch('new property', function(path, current, previous) {
			called = true;
		});
		config.set('new property', 'new value');
		assert(called, 'watch() should invoke callback');
	});
}

function watch_raise_when_updating_values()
{
	var config = require('../core/configuration')('config.json');
	config.connect(function(err) {
		if(err)
			throw new Error('error loading config.json file');

		var called = false;
		config.watch('property', function(path, current, previous) {
			called = true;
		});
		config.set('property', 'new value');
		assert(called, 'watch() should invoke callback');
	});
}

function watch_notraise_when_settingthesame_values()
{
	var config = require('../core/configuration')('config.json');
	config.connect(function(err) {
		if(err)
			throw new Error('error loading config.json file');

		var called = false;
		config.watch('property', function(path, current, previous) {
			called = true;
		});
		config.set('property', 'flat');
		assert(!called, 'watch() should not invoke callback');
	});
}

function watch_notraise_when_saving_values()
{
	var fs = require('fs');
	fs.unlink('watch1.json', function(err) {

		var config = require('../core/configuration')('watch1.json');
		config.connect(function(err) {
			if(err)
				throw new Error('error loading watch1.json file');

			config.set('property', 'random');
			var called = false;
			config.watch('property', function(path, current, previous) {
				called = true;
			});

			config.save(function(err) {
				if(err)
					throw new Error('error saving watch1.json file');

				setTimeout(function() {
					assert(!called, 'watch() should not invoke callback');
				}, 6000);
			});
		});

	});
}

function watch_raise_when_file_changes()
{
	var fs = require('fs');
	fs.unlink('watch2.json', function(err)
	{

		var config = require('../core/configuration')('watch2.json');
		config.connect(function(err)
		{
			if(err)
				throw new Error('error loading watch2.json file');

			config.set('property', 'value');
			config.save(function(err)
			{
				if(err)
					throw new Error('error saving watch2.json file');

				var called = false;
				config.watch('property', function(path, current, previous)
				{
					called = true;
				});

				var fs = require('fs');
				fs.writeFile('watch2.json', '{"property":"new value"}', function(err)
				{
					if(err)
						throw new Error('error changing watch2.json file');

					setTimeout(function()
					{
						assert(called, 'watch() should invoke callback');
					}, 6000);
				});

			});
		});

	});
}

exports.test = function() {
	load();

	get_returns_undefined_value();
	get_returns_default_value();
	set_undefined_value();
	set_existing_value();
	get_returns_value();
	set_undefined_deep_property();
	set_existing_deep_property();
	set_intermediate_property();
};

var assert = require('assert');
var config = require('../core/configuration')('config.json');

function load()
{
	config.load(function(err, data) {

		var a = data;

	});
}

function get_returns_undefined_value()
{
	var v = config.get('undefinedvalue1');
	assert(typeof v === 'undefined', 'get() should return undefined value');
}

function get_returns_default_value()
{
	var v = config.get('undefinedvalue2', 'default');
	assert(v === 'default', 'get() should return default value');
}

function set_undefined_value()
{
	config.set('value1', 'test');
	assert(config.get('value1') === 'test', 'set() should set value');
}

function set_existing_value()
{
	config.set('value1', 'initial value');
	config.set('value1', 'test');
	assert(config.get('value1') === 'test', 'set() should set value');
}


function get_returns_value()
{
	config.set('value2', 'test');
	assert(config.get('value2') === 'test', 'get() should return current value');
	assert(config.get('value2', 'default') === 'test', 'get() should return current value');
}

function set_undefined_deep_property()
{
	config.set('folder1/value', 'test');
	assert(config.get('folder1/value') === 'test', 'set() should set value');

	config.set('folder1/folder11/folder111/value', 'test');
	assert(config.get('folder1/folder11/folder111/value') === 'test', 'set() should set value');
}

function set_existing_deep_property()
{
	config.set('folder2/value', 'initial value');
	config.set('folder2/value', 'test');
	assert(config.get('folder2/value') === 'test', 'set() should set value');
}

function set_intermediate_property()
{
	config.set('folder3/folder31/value', 'test');
	config.set('folder3/value', 'intermediate');
	assert(config.get('folder3/value') === 'intermediate', 'set() should set value');
	assert(config.get('folder3/folder31/value') === 'test', 'deeper set() should not affect intermediate values');
}
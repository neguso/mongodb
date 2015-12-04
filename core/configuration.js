'use strict';

var fs = require('fs');

module.exports = function(file)
{
	let current = {};

	return {

		load: function(cb) {
			fs.access(file, fs.F_OK | fs.R_OK, function(err) {
				if(err) return;

				fs.readFile(file, function(err, data) {
					if(err) cb(err);

					cb(null, JSON.parse(data));
				});
			});
		},

		set: function(path, value) {
			parse(path, function(object, property) {
				object[property] = value;
			});
		},

		get: function(path, defaultValue) {
			var value = defaultValue;
			parse(path, function(object, property) {
				value = object[property];
			});
			if(typeof value === 'undefined')
				return defaultValue;
			else
				return value;
		},

		read: function()
		{
			return JSON.parse(JSON.stringify(current));
		}
	};


	function parse(path, callback)
	{
		var ary = path.split('/');
		var o = current;
		for(let i = 0; i < ary.length; i++)
		{
			if(i === ary.length - 1)
				callback(o, ary[i]);
			else {
				if (!o.hasOwnProperty(ary[i]))
					o[ary[i]] = {};
				o = o[ary[i]];
			}
		}
	}
};

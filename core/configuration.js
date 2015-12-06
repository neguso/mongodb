'use strict';

var fs = require('fs');
var restify = require('restify');

module.exports = function(file)
{
	let current = {}, previous = {};
	let watchlist = [];

	return {

		connect: function(cb)
		{
			fs.access(file, fs.F_OK | fs.R_OK, function(err)
			{
				if(err) {
					previous = clone(current = {});

					cb(null);
					watch();
					return;
				}

				fs.readFile(file, function(err, data)
				{
					if(err) {
						cb(err);
						return;
					}

					try {
						previous = clone(current = JSON.parse(data));
					}
					catch(error) {
						cb(error);
						return;
					}

					cb(null);
					watch();
				});
			});
		},

		json: function(cb)
		{
			return JSON.stringify(current);
		},

		set: function(path, value)
		{
			parse(current, path, function(object, property)
			{
				object[property] = clone(value);
			}, true);
			notify(watchlist, path, current, previous, function(watch, currentvalue, previousValue)
			{
				watch.callback(path, currentvalue, previousValue);
			});
			previous = clone(current);
		},

		get: function(path, defaultValue)
		{
			var value = defaultValue;
			parse(current, path, function(object, property)
			{
				value = object[property];
			});
			if(typeof value === 'undefined')
				return defaultValue;
			else
				return clone(value);
		},

		save: function(cb)
		{
			unwatch();
			fs.writeFile(file, JSON.stringify(current, null, '\t'), function(err)
			{
				watch();

				if(err) {
					cb(err);
					return;
				}

				cb(null);
			});
		},

		watch: function(path, cb)
		{
			if(watchlist.indexOf(path) === -1)
				watchlist.push({path: path, callback: cb});
		},

		unwatch: function(path)
		{
			let i = watchlist.indexOf(path);
			if(i !== -1)
				watchlist.splice(i, 1);
		}
	};


	function parse(config, path, callback, create)
	{
		var ary = path.split('/');
		for(let i = 0; i < ary.length; i++) {
			if(i === ary.length - 1)
				callback(config, ary[i]);
			else {
				if(!config.hasOwnProperty(ary[i])) {
					if(create)
						config[ary[i]] = {};
					else {
						callback(config, ary[i]);
						return;
					}
				}
				config = config[ary[i]];
			}
		}
	}

	function equals(c1, c2, path)
	{
		var v1, v2;
		parse(c1, path, function(object, property)
		{
			v1 = object[property];
		});
		parse(c2, path, function(object, property)
		{
			v2 = object[property];
		});
		return JSON.stringify(v1) === JSON.stringify(v2);
	}

	function notify(watchlist, path, current, previous, callback)
	{
		for(let i = 0; i < watchlist.length; i++) {
			let currentValue, previousValue;
			parse(current, path, function(object, property)
			{
				currentValue = object[property];
			});
			parse(previous, path, function(object, property)
			{
				previousValue = object[property];
			});

			if(watchlist[i].path.startsWith(path) && JSON.stringify(currentValue) !== JSON.stringify(previousValue))
				callback(watchlist[i], currentValue, previousValue);
		}
	}

	function clone(o)
	{
		return JSON.parse(JSON.stringify(o));
	}

	function watch()
	{
		fs.unwatchFile(file);
		fs.watchFile(file, { persistent: false }, function(curr, prev)
		{

			fs.readFile(file, function(err, data)
			{
				if(err) return;

				try {
					current = JSON.parse(data);
				}
				catch(error) {
					return;
				}

				var called = [];
				watchlist.forEach(function(item)
				{
					notify(watchlist, item.path, current, previous, function(watch, currentvalue, previousValue)
					{
						if(called.indexOf(watch) === -1) {
							watch.callback(watch.path, currentvalue, previousValue);
							called.push(watch);
						}
					});
				});

				previous = clone(current);
			});

		});
	}

	function unwatch()
	{
		fs.unwatchFile(file);
	}

};

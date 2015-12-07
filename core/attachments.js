'use strict';

var fs = require('fs'),
		path = require('path');

module.exports = function(folder)
{
	return {
		store: function(data, type, cb)
		{
			var key = random();
			var file = path.join(folder, key + '.' + type);

			fs.writeFile(file, data, function(err) {
				if(err) return cb(err, null);

				cb(null, key + '.' + type);
			});
		},

		update: function(key, data, type, cb)
		{
			var file = path.join(folder, key + '.' + type);

			fs.writeFile(file, data, function(err) {
				if(err) return cb(err, null);

				cb(null, key + '.' + type);
			});
		},

		load: function(key, encoding, cb) {
			var file = path.join(folder, key);
			fs.readFile(file, encoding, function(err, data) {
				if(err)
				{
					if(err.code === 'ENOENT')
						return cb(null, null);
					return cb(err, null);
				}

				cb(null, data);
			});
		},

		remove: function(key, cb)
		{
			var file = path.join(folder, key);
			fs.unlink(file, function(err) {
				if(err) return cb(err);

				cb(null);
			});
		}

	};
};


function random()
{
	var ary = new Array(10);
	var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	for(var i = 0; i < 10; i++)
		ary[i] = chars.charAt(Math.floor(Math.random() * chars.length));
	return ary.join('');
}

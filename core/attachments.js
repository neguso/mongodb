'use strict';

var fs = require('fs'),
	path = require('path'),
	restify = require('restify');

module.exports = function(folder)
{
	var server;

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

		load: function(key, encoding, cb)
		{
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
		},

		listen: function(port, cb)
		{
			server = restify.createServer();
			server.get('/:key/:file', function(request, response, next) {

				var file = path.join(folder, request.params.key + path.extname(request.params.file));
				fs.readFile(file, function(err, data) {
					if(err)
					{
						response.send(new restify.NotFoundError('File not found.'));
						response.end();
						return;
					}

					response.header('Content-disposition', 'attachment; filename=' + request.params.file);
					response.end(data);
				});

				next();
			});

			server.listen(port, cb);
		},

		close: function(cb)
		{
			if(typeof cb === 'function')
				server.close(cb);
			else
				server.close();
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

'use strict';

var fs = require('fs'),
	path = require('path');

module.exports = function(folder)
{

	return {

		store: function(data, file, cb)
		{
			file = path.join(folder, file);

			fs.writeFile(file, data, function(err) {
				if(err) return cb(err);

				cb(null);
			});
		}

	};
};

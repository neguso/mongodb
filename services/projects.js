var q = require('q');
var models = require('../models');

exports.Projects = {

	/**
	 * Read user projects.
	 * @param userId - User ID.
	 * @returns {Promise} A promise that returns an array of projects.
	 */
  read: function(userId)
  {
		var defer = q.defer();

    models.Project.find({}, 'name description', {}, function(err, documents)
    {
			if(err) return defer.reject(err);

			defer.resolve(documents);
    });

		return q.promise;
  },

	/**
	 * Get a project.
	 * @param projectId - Project ID.
	 */
	get: function(projectId)
	{


	}


};








/**
 * Node style callback.
 * @callback ReadCallback
 * @param err - Null if operation succeeded, an Error object otherwise.
 * @param {ProjectInfo[]} projects - Array of projects.
 */

/**
 * Project object.
 * @typedef {object} ProjectInfo
 * @property {string} name - Name of the project.
 * @property {string} description - Description of the project.
  */

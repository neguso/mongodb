var q = require('q');
var models = require('../models');

exports.Projects = {

	/**
	 * Read user projects.
	 * @param {ObjectID} userId
	 * @returns {Promise} A promise that returns an array of {@link ProjectInfo} objects.
	 */
  read: function(userId)
  {
		var defer = q.defer();

   /* models.Project.find({}, 'name description', { lean: true }, function(err, documents)
	 {
	 if(err) return defer.reject(err);
	 defer.resolve(documents);
	 });*/

		models.ProjectUserLink.find({ user: userId }, null, { lean: true }, function(err, documents)
		{
			if(err) return defer.reject(err);
			defer.resolve(documents);
		});


		return defer.promise;
  },

	/**
	 * Get a project.
	 * @param {ObjectID} projectId
	 * @returns {Promise} A promise that returns a {@link ProjectModel} object.
	 */
	get: function(projectId)
	{
		var defer = q.defer();

		models.Project.findById(projectId, function(err, document)
		{
			if(err) return defer.reject(err);
			defer.resolve(document);
		});

		return defer.promise;

	}


};










/**
 * Project information object.
 * @typedef {object} ProjectInfo
 * @prop {ObjectID} _id
 * @prop {string} name
 * @prop {string} description
  */

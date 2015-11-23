var models = require('../models');


exports.Projects = {

	/**
	 * Read user projects.
	 * @param {ObjectID} userId
	 * @returns {Promise} A promise that returns an array of {@link ProjectInfo} objects.
	 */
  read: function(userId)
  {
		return new Promise(function(resolve, reject) {

			models.Project.find({}, 'name description', { lean: true }, function(err, documents)
			{
				if(err) return reject(err);

				resolve(documents);
			});

		});


		models.ProjectUserLink.find({ user: userId }, null, { lean: true }, function(err, documents)
		{
			if(err) return defer.reject(err);
			defer.resolve(documents);
		});
  },

	/**
	 * Get a project.
	 * @param {ObjectID} projectId
	 * @returns {Promise} A promise that returns a {@link ProjectModel} object.
	 */
	get: function(projectId)
	{
		return new Promise(function(resolve, reject) {

			models.Project.findById(projectId, function(err, document)
			{
				if(err) return reject(err);

				resolve(document);
			});

		});
	}


};










/**
 * Project information object.
 * @typedef {object} ProjectInfo
 * @prop {ObjectID} _id
 * @prop {string} name
 * @prop {string} description
  */

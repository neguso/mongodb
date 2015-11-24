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

			models.ProjectUserLink.find({ user: userId }, 'project', { lean: true }).populate('project', 'name description').exec(function(err, documents)
			{
				if(err) return reject(err);

				resolve(documents.map(function(p) { return { _id: p._id, name: p.name, description: p.description } }));
			});

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

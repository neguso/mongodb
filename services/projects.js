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
	 * @param {ObjectID} id
	 * @returns {Promise} A promise that returns a {@link ProjectModel} object.
	 */
	get: function(id)
	{
		return new Promise(function(resolve, reject) {

			models.Project.findById(id, function(err, document)
			{
				if(err) return reject(err);

				resolve(document);
			});

		});
	},

	/**
	 * Save a project.
	 * @param {ProjectModel} project - Project model object to be saved.
	 * @returns {Promise} A promise that returns the supplied object.
	 */
	update: function(project)
	{
		return new Promise(function(resolve, reject) {

			project.save(function(err, document, numAffected) {
				if(err) return reject(err);

				resolve(document);
			});

		});
	},

	/**
	 * Delete a project.
	 * @param {ObjectID} id
	 * @returns {Promise} A promise that returns the deleted {@link ProjectModel} project.
	 */
	remove: function(id)
	{
		return new Promise(function(resolve, reject) {

			models.Project.findById(id, function(err, document)
			{
				if(err) return reject(err);

				document.remove(function(err) {
					if(err) return reject(err);

					resolve(document);
				});
			});

		});
	},

	/**
	 * Create one or more projects.
	 * @param {ProjectModel,[ProjectModel]} projects - An object or array of objects.
	 * @returns {Promise} A promise that returns a {@link ProjectModel} object or an array of objects.
	 */
	create: function(projects)
	{
		return new Promise(function(resolve, reject) {

			models.Project.create(projects, function(err, documents)
			{
				if(err) return reject(err);

				resolve(documents);
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

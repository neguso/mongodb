var mongoose = require('mongoose');
var plugins = require('./plugins.js');
var models = { ProjectUserLink: require('./projectuserlink.js').ProjectUserLink };

var config = require('../core/configuration.js')('config.json');
var attachments = require('../core/attachments.js')();


var Schema = mongoose.Schema;

var containerSchema = new Schema({
	name: Schema.Types.String,
	description: Schema.Types.String
}),
	tagSchema = new Schema({
	name: Schema.Types.String,
	color: Schema.Types.String
});

var projectSchema = Schema({
	name: Schema.Types.String,
	description: Schema.Types.String,
	containers: [containerSchema],
	tags: [tagSchema]
});

projectSchema.plugin(plugins.files);
projectSchema.plugin(plugins.createdon);
projectSchema.plugin(plugins.updatedon);

projectSchema.index({ name: 1 }, { name: 'ix_name' });

var ProjectModel = mongoose.model('Project', projectSchema);

exports.Project = ProjectModel;


projectSchema.pre('remove', function(next) {

	// cascade delete user links
	models.ProjectUserLink.find({ project: this._id }).remove().exec();

	// cascade delete files


	next();
});

/**
 * Read user projects.
 * @param {ObjectID} userId
 * @returns {Promise} A promise that returns an array of {@link ProjectInfo} objects.
 */
projectSchema.statics.read = function(userId) {
	return new Promise(function(resolve, reject) {

		models.ProjectUserLink.find({ user: userId }, 'project', { lean: true }).populate('project', 'name description').exec(function(err, documents)
		{
			if(err) return reject(err);

			resolve(documents.map(function(p) { return { _id: p.project._id, name: p.project.name, description: p.project.description } }));
		});

	});
};



/**
 * Project model object.
 * @typedef {object} ProjectModel
 * @prop {ObjectID} _id
 * @prop {string} name
 * @prop {string} description
 * @prop { Array.<ContainerModel> } containers
 * @prop { Array.<TagModel> } tags
 * @prop { Array.<FileModel> } files
 */

/**
 * Container model object.
 * @typedef {object} ContainerModel
 * @prop {string} name
 * @prop {string} description
 */

/**
 * Tag model object.
 * @typedef {object} TagModel
 * @prop {string} name
 * @prop {string} color
 */

/**
 * File model object.
 * @typedef {object} FileModel
 * @prop {string} name
 * @prop {number} size
 * @prop {string} key
 */
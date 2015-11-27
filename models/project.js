var mongoose = require('mongoose');
var plugins = require('./plugins.js');

var projectuserlink = require('./projectuserlink.js');
var storage = require('../core/storage.js');

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

projectSchema.pre('remove', function(next) {

	// cascade delete user links
	projectuserlink.ProjectUserLink.find({ project: this._id }).remove().exec();

	// delete related resources
	if(Array.isArray(this.files))
		storage.Resources.remove(this.files.map(function(file) { return file.key; }));

	next();
});

exports.Project = mongoose.model('Project', projectSchema);


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
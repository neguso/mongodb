var mongoose = require('mongoose');
var plugins = require('./plugins.js');

var Schema = mongoose.Schema;

var containerSchema = new Schema({
	name: Schema.Types.String,
	description: Schema.Types.String
});

var tagSchema = new Schema({
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

exports.Project = mongoose.model('Project', projectSchema);

/**
 * Project model object.
 * @typedef {object} ProjectModel
 * @prop {ObjectID} _id
 * @prop {string} name
 * @prop {string} description
 * @prop { Array.<ContainerModel> } containers
 * @prop { Array.<TagModel> } tags
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
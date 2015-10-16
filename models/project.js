var mongoose = require('mongoose');
var plugins = require('./plugins.js');

var Schema = mongoose.Schema;

var containerSchema = new Schema({
	name: Schema.Types.String,
	description: Schema.Types.String
});

var projectSchema = Schema({
  name: Schema.Types.String,
  description: Schema.Types.String,
	containers: [containerSchema]
});

projectSchema.plugin(plugins.createdon);
projectSchema.plugin(plugins.updatedon);

projectSchema.index({ name: 1 }, { name: 'ix_name' });

exports.Project = mongoose.model('Project', projectSchema);

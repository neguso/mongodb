var mongoose = require('mongoose');
var plugins = require('./plugins.js');

var Schema = mongoose.Schema;

var projectSchema = Schema({
  name: Schema.Types.String,
  description: Schema.Types.String,
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

projectSchema.plugin(plugins.createdon);
projectSchema.plugin(plugins.updatedon);

projectSchema.index({ name: 1 }, { name: 'ix_name' });

exports.Project = mongoose.model('Project', projectSchema);

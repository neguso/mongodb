var mongoose = require('mongoose');
var plugins = require('./plugins.js');

var Schema = mongoose.Schema;

var taskSchema = Schema({
  name: Schema.Types.String,
  description: Schema.Types.String,
	start: Schema.Types.Date,
	due: Schema.Types.Date,
  project: { type: Schema.Types.ObjectId, ref: 'Project' }
});

taskSchema.plugin(plugins.files);
taskSchema.plugin(plugins.createdon);
taskSchema.plugin(plugins.updatedon);

taskSchema.index({ name: 1 }, { name: 'ix_name' });

exports.Task = mongoose.model('Task', taskSchema);

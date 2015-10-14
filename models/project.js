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

projectSchema.virtual('uname').get(function()
{
  return this.name.toUpperCase();
});

projectSchema.index({ name: 1 }, { name: 'ix_name' });

projectSchema.methods.upper = function()
{
  // this - the document object
  return this.name.toUpperCase();
};

projectSchema.statics.findByName = function(name, cb)
{
  // this - the model object
  return this.find({ name: new RegExp(name, 'i') }, cb);
};

exports.Project = mongoose.model('Project', projectSchema);

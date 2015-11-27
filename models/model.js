var mongoose = require('mongoose');
var plugins = require('./plugins.js');

var Schema = mongoose.Schema;

var xxxSchema = Schema({
	f1: Schema.Types.String,
	f2: [{ type: Schema.Types.ObjectId, ref: 'yyy' }]
});

xxxSchema.virtual('property').get(function()
{
	return /*expression*/;
});

xxxSchema.plugin(plugins.createdon);
xxxSchema.plugin(plugins.updatedon);

xxxSchema.index({ f1: 1 }, { name: 'ix_f1' });

xxxSchema.methods.m1 = function()
{
	// this - the document object
};

xxxSchema.statics.s1 = function()
{
	// this - the model object
};

exports.eee = mongoose.model('eee', xxxSchema);

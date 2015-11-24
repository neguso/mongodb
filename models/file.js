var mongoose = require('mongoose');
var plugins = require('./plugins.js');

var Schema = mongoose.Schema;

var fileSchema = Schema({
	name: Schema.Types.String,
	size: Schema.Types.Number,
	key: Schema.Types.String
});

fileSchema.plugin(plugins.createdon);
fileSchema.plugin(plugins.updatedon);

fileSchema.index({ name: 1 }, { name: 'ix_name' });

exports.File = mongoose.model('File', fileSchema);

var mongoose = require('mongoose');
var plugins = require('./plugins.js');

var Schema = mongoose.Schema;

var userSchema = Schema({
	email: Schema.Types.String,
	firstname: Schema.Types.String,
	lastname: Schema.Types.String
});

userSchema.plugin(plugins.createdon);
userSchema.plugin(plugins.updatedon);

userSchema.virtual('fullname').get(function()
{
	return this.firstname + ' ' + this.lastname;
});

userSchema.index({ email: 1 }, { name: 'ix_email', unique: true });

exports.User = mongoose.model('User', userSchema);

var mongoose = require('mongoose');
var plugins = require('./plugins.js');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	email: Schema.Types.String,
	firstname: Schema.Types.String,
	lastname: Schema.Types.String
}, { timestamps: { createdAt: 'createdon', updatedAt: 'updatedon' } });

userSchema.virtual('fullname').get(function()
{
	return this.firstname + ' ' + this.lastname;
});

userSchema.index({ email: 1 }, { name: 'ix_email', unique: true });

var User = mongoose.model('User', userSchema);

exports.User = User;

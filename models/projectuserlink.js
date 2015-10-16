var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var projectuserlinkSchema = Schema({
	role: Schema.Types.String,
	project: { type: Schema.Types.ObjectId, ref: 'Project' },
	user: { type: Schema.Types.ObjectId, ref: 'User' }
});

projectuserlinkSchema.index({ project: 1, user: 1 }, { name: 'ix_project_user', unique: true });

exports.ProjectUserLink = mongoose.model('ProjectUserLink', projectuserlinkSchema);

var models = require('../models');

exports.Projects = {

  read: function(cb)
  {
    models.Project.find({}, function(err, docs)
    {
      cb(err, docs);
    });
  },

  getUsers: function(projectid, cb)
  {
    
  }


};
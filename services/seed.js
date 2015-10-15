var Q = require('q');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var mongoose = require('mongoose');
var models = require('../models');


exports.all = function()
{
  console.log('seeding projects...');
  seed_projects()
    .then(function(result) { console.log('done'); })
    .catch(function(reason) { });

};


var seed_projects = async(function()
{
  var project = {
    count: Q.nbind(models.Project.count, models.Project),
    create: Q.nbind(models.Project.create, models.Project)
  };

  try
  {
    var count = await(project.count({}));
    if(count === 0)
    {
      for(var batch = 0; batch < 100; batch++)
      {
        var ary = [];
        for(var i = 0; i < 1000; i++)
          ary.push({ name: 'project name ' + i.toString(), description: 'project ' + i.toString() + ' description goes here' });
        await(project.create(ary));
      }
    }
  }
  catch(err)
  {
    console.error('Error seeding Projects: ' + err);
  }
});

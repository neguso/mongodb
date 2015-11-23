var Q = require('q');
var mongoose = require('mongoose');
var models = require('./models');
var services = require('./services/projects');
var seed = require('./services/test');


var async = require('asyncawait/async');
var await = require('asyncawait/await');


var seedf = async(function()
{
    var count = Q.nbind(models.Project.count, models.Project);
    var create = Q.nbind(models.Project.create, models.Project);
    var find = Q.nbind(models.Project.find, models.Project);

    try
    {
        var count = await(count({}));
        if(count === 0)
        {
            for(var i = 0; i < 10; i++)
                await(create({ name: 'project - ' + i.toString(), description: 'the project description goes here' }));
        }
        var result = await(find({ namex: 'project - 1234' }));

        var t = await(test(1));

        var nt = await(Q.nfcall(ntest, 10));

        return 123;
    }
    catch (err)
    {
        var a = 1;
    }
});

function test(a)
{
    var defer = Q.defer();

    setTimeout(function()
    {
        defer.reject(a + 1);
    }, 1000);

    return defer.promise;
}

function ntest(a, cb)
{
    setTimeout(function()
    {
        cb('motive', a + 1);
    }, 1000);
}


mongoose.connection.on('error', function()
{
    console.log('MongoDB connection error.');
});

mongoose.connection.once('open', function(callback)
{
    seed.all();



    return;

    seedf()
        .then(function(result)
        {

        })
        .catch(function(reason)
        {

        })
        .finally(function()
        {

        });



    return;


    var count = Q.nbind(models.Project.count, models.Project);
    var create = Q.nbind(models.Project.create, models.Project);
    var find = Q.nbind(models.Project.find, models.Project);

    console.log('count');
    count({})
        .then(function(result) {
            console.log('count.done');

            console.log('create or none');
            if(result === 0)
            {
                var ary = [];
                for(var i = 0; i < 10; i++)
                    ary.push(create({ name: 'project - ' + i.toString(), description: 'the project description goes here' }));
                return Q.all(ary);
            }

            return Q(true);
        })
        .then(function(result) {
            console.log('done.create or none');

            return find({ namex: 'project - 1234' });
        })
        .then(function(result) {
            console.log('done');

        })
        .catch(function(reason) {
            console.log('error');
        })
        .finally(function() {
            console.log('finally');
        });





    return;


    models.Project.count({}, function(err, count)
    {
        if(err) return handleError(err);

        if(count === 0)
        {
            // create some projects
            console.log('create some projects');
            for(var i = 0; i < 10000; i++)
            {
                models.Project.create({ name: 'project - ' + i.toString(), description: 'the project description goes here' }, function(err)
                {
                    if(err) return handleError(err);

                });
            }

            console.log('done');
        }

        // find some projects
        console.log('find some projects');
        models.Project.find({ name: 'project - 1234' }, function(err, projects)
        {
            if(err) return handleError(err);

            for(var i = 0; i < projects.length; i++)
                console.log(projects[i]);

            console.log('done');
        });


        models.Task.count({}, function(err, count)
        {
            if(err) return handleError(err);

            if(count === 0)
            {
                // create some tasks
                for(var p = 0; p < 5; p++)
                {
                    models.Project.findOne({ name: 'project - ' + p.toString() }, function(err, project)
                    {
                        if(err) return handleError(err);

                        for(var t = 0; t < 10; t++)
                        {
                            models.Task.create({ name: 'task - ' + t.toString(), project: project.id }, function(err, task)
                            {
                                if(err) return handleError(err);

                            });
                        }
                    });
                }
            }
        });


        models.Task.findOne({ name: 'task - 1' }).populate('project', '-description').exec(function(err, task)
        {
            if(err) return handleError(err);

            //var p = task.project;
            //var s = p.tasks;
        });

        models.Project.findOne({ name: 'project - 0' }, function(err, project)
        {
            if(err) return handleError(err);

            models.Task.where('project', project.id).exec(function(err, tasks)
            {
                if(err) return handleError(err);

            });
        });


    });
});

mongoose.connect('mongodb://192.168.99.100/project');


function handleError(err)
{
    console.error(err);
}

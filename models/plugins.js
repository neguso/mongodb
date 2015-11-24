var mongoose = require('mongoose');

var Schema = mongoose.Schema;

exports.createdon = function(schema)
{
  schema.add({ createdon: { type: Schema.Types.Date, default: Date.now } });
};

exports.updatedon = function(schema)
{
  schema.add({ updatedon: { type: Schema.Types.Date } });
  
  schema.pre('save', function(next)
  {
    this.updatedon = new Date();
    
    next();
  });
};

var fileSchema = Schema({
	name: Schema.Types.String,
	size: Schema.Types.Number,
	key: Schema.Types.String
});

exports.files = function(schema)
{
	schema.add({ files: [fileSchema] });
};

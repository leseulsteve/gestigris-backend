'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp');

var ResponsableSchema = new Schema({
  nomComplet: {
    type: String
  }
});

ResponsableSchema.plugin(timestamps);

module.exports = mongoose.model('responsable-groupe', ResponsableSchema);

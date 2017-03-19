'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp');

var InterventionTagSchema = new Schema({
  name: {
    type: String
  },
  searchField: {
    type: String
  }
});

InterventionTagSchema.plugin(timestamps);

InterventionTagSchema.pre('save', function(next) {
  this.searchField = _.deburr(this.name).toLowerCase();
  next();
});

module.exports = mongoose.model('intervention-tag', InterventionTagSchema);

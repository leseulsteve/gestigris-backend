'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ConfigSchema = new Schema({
  name: {
    type: String
  },
  data: {}
});

module.exports = mongoose.model('config', ConfigSchema);

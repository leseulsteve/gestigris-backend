'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp');

var ContactSchema = new Schema({
  firstname: {
    type: String,
    required: 'Le prénom est requis'
  },
  lastname: {
    type: String,
    required: 'Le nom de famille est requis'
  },
  poste: {
    type: Schema.ObjectId,
    ref: 'poste'
  },
  email: {
    type: String
  },
  etablissements: [{
    type: Schema.ObjectId,
    ref: 'etablissement'
  }]
});

ContactSchema.plugin(timestamps);

ContactSchema.methods.toString = function() {
  return this.firstname + ' ' + this.lastname;
};

ContactSchema.methods.getEmail = function() {
  return this.email;
};

module.exports = mongoose.model('contact', ContactSchema);

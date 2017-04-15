'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp'),
  User = require('../../models/user');

var BenevoleSchema = new Schema({
  normalisedFirstName: {
    type: String
  },
  telephones: [{
    no: {
      type: String,
      require: true
    },
    description: {
      type: String
    }
  }],
  dateNaissance: {
    type: Date,
    required: true
  },
  sexe: {
    type: String,
    enum: ['homme', 'femme']
  },
  orientation: {
    type: String,
    enum: ['homosexuel', 'bisexuel']
  },
  voiture: {
    type: Boolean,
    default: false
  },
  role: {
    type: Schema.ObjectId,
    ref: 'benevole-role',
    required: true
  },
  searchField: {
    type: String
  }
});

BenevoleSchema.plugin(timestamps);

BenevoleSchema.pre('save', function(next) {
  this.searchField = _.deburr([
    this.prenom,
    this.nomFamille,
    this.email
  ].join(' ')).toLowerCase();
  this.normalisedFirstName = _.deburr(this.prenom);
  next();
});


module.exports = User.discriminator('benevole', BenevoleSchema);

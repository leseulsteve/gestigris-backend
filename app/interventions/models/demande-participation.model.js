'use strict';

var q = require('q'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp'),
  Intervention = require('./intervention.model');

var DemandeParticipationSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  intervention: {
    type: Schema.ObjectId,
    ref: 'intervention',
    required: true
  },
  benevole: {
    type: Schema.ObjectId,
    ref: 'benevole',
    required: true
  },
  accepted: {
    type: Boolean,
    default: false
  },
  confirmed: {
    type: Boolean,
    default: false
  }
});

DemandeParticipationSchema.index({
  benevole: 1,
  intervention: 1
}, {
  unique: true
});

DemandeParticipationSchema.plugin(timestamps);

DemandeParticipationSchema.pre('save', function(next) {

  if (!this.isNew) {
    var demande = this;

    if (this.isModified('accepted')) {
      return Intervention
        .findById(demande.intervention)
        .then(function(intervention) {
          return demande.accepted ? intervention.addParticipant(demande) : intervention.removeParticipant(demande);
        })
        .then(next)
        .catch(next);
    }
    next();
  }
  next();
});

module.exports = mongoose.model('demande-participation', DemandeParticipationSchema);

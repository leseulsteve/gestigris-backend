'use strict';

var _ = require('lodash'),
  q = require('q'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp'),
  Plage = require('./plage.model'),
  PlageIntervention = require('./plage.model'),
  RefutationParticipationNotifier = require('../services/notifiers/refutation-participation'),
  ConfirmationParticipationNotifier = require('../services/notifiers/confirmation-participation'),
  ChangeInterventionNotifier = require('../services/notifiers/change-intervention');

var InterventionSchema = new Schema({
  date: {
    start: {
      type: Date
    },
    end: {
      type: Date
    }
  },
  plage: {
    type: Schema.ObjectId,
    ref: 'plage-intervention'
  },
  status: {
    type: String,
    emum: ['OPEN', 'CLOSE'],
    default: 'OPEN'
  },
  contact: {
    type: Schema.ObjectId,
    ref: 'contact'
  },
  responsableGroupe: {
    type: String
  },
  local: {
    type: String
  },
  lieuRencontre: {
    type: String
  },
  tags: [{
    type: Schema.ObjectId,
    ref: 'intervention-tag'
  }]
});

InterventionSchema.plugin(timestamps);

InterventionSchema.pre('save', function(next) {

  var intervention = this;

  PlageIntervention.findById(intervention.plage).then(function(plage) {

    if (intervention.isNew) {
      return plage.updateStatus(intervention)
        .then(next)
        .catch(next);
    }

    q.all([
        intervention.isModified('status') && intervention.status === 'CLOSE' ? intervention.close() : q.when(),
        intervention.isModified('tags') ? _.assign(plage, {
          tags: _.uniqBy(intervention.tags, function(tagId) {
            return tagId.toString();
          })
        }).save() : q.when(),
        intervention.isModified() && intervention.notifyChanges ? ChangeInterventionNotifier.notify(intervention) : q.when()
      ])
      .then(next)
      .catch(next);
  });

});

InterventionSchema.methods.isClosed = function() {
  return this.status === 'CLOSE';
};

InterventionSchema.methods.close = function() {
  var intervention = this,
    DemandeParticipation = require('./demande-participation.model');

  return q.all([
    DemandeParticipation.find({
      intervention: this._id
    }).then(function(demandesParticipation) {
      return q.all(_.map(_.filter(demandesParticipation, 'confirmed', true), function(demandeParticipation) {
        return (demandeParticipation.accepted ? ConfirmationParticipationNotifier : RefutationParticipationNotifier).notify(intervention, demandeParticipation);
      }));
    }),
    PlageIntervention.findById(intervention.plage).then(function(plage) {
      plage.updateStatus(intervention);
    })
  ]);
};

InterventionSchema.methods.addParticipant = function(demande) {
  return q.all([
    PlageIntervention.findById(this.plage)
    .then(function(plage) {
      return plage.addParticipants([demande.benevole]);
    }),
    this.isClosed() ? ConfirmationParticipationNotifier.notify(this, demande) : q.when()
  ]);
};

InterventionSchema.methods.removeParticipant = function(demande) {
  return q.all([
    PlageIntervention.findById(this.plage)
    .then(function(plage) {
      return plage.removeParticipant(demande.benevole);
    }),
    this.isClosed() ? RefutationParticipationNotifier.notify(this, demande) : q.when()
  ]);
};


InterventionSchema.methods.getParticipants = function() {
  return DemandeParticipation
    .find({
      intervention: this._id,
      accepted: true
    })
    .select('benevole')
    .lean()
    .then(function(demandes) {
      return _.map(demandes, 'benevole');
    })
};

module.exports = mongoose.model('intervention', InterventionSchema);

'use strict';

var q = require('q'),
  _ = require('lodash'),
  moment = require('moment'),
  mongoose = require('mongoose'),
  Demande = mongoose.model('demande-participation'),
  Intervention = mongoose.model('intervention'),
  DemandeConfirmationNotifier = require('./notifiers/demande-confirmation-intervention');

/*require('../../benevoles/models/benevole.model').find().then(function(benevoles) {
  require('../../interventions/models/intervention.model').find().then(function(interventions) {
    _.forEach(interventions, function(intervention) {
      Demande.create(_.map(_.take(benevoles, 5), function(benevole) {
        console.log(benevole);
        return {
          benevole: benevole._id,
          intervention: intervention._id,
          confirmed: true
        }
      })).then(function(results) {
        console.log(results);
      }).catch(console.log);
    });
  });
})*/

module.exports = {

  create: function(params, user) {
    var that = this;
    return Demande
      .create(params)
      .then(function(demande) {

        function returnDemande() {
          return that.findById(demande._id);
        }

        // n'était pas intéressé
        if (!params.confirmed && params.accepted) {
          return _.isUndefined(params.message) ? q.reject('Missing message!') : DemandeConfirmationNotifier
            .notify(demande, params.message, user)
            .then(returnDemande);
        }

        return returnDemande();
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        })
      });
  },

  findById: function(id) {
    return this.find({
      _id: id
    }).then(_.first);
  },

  find: function(query) {
    return Demande
      .find(query)
      .sort('-date')
      .select('-__v -_type')
      .populate('etablissement')
      .exec()
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        })
      });
  },

  update: function(id, params) {
    var that = this;
    return Demande.findById(id)
      .then(function(demande) {
        return _.assign(demande, params)
          .save()
          .then(function() {
            return that.findById(id);
          });
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        })
      });
  },

  remove: function(id) {
    return Demande
      .findById(id)
      .populate('intervention')
      .then(function(demande) {

        function remove() {
          return demande.remove();
        }

        if (demande.confirmed && demande.accepted) {
          return demande.intervention.removeParticipant(demande).then(remove);
        }
        return remove();
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        })
      });
  }
};

'use strict';

var _ = require('lodash'),
  path = require('path'),
  moment = require('moment'),
  notificationsService = require('../../../notifications'),
  InterventionTags = require('../../models/intervention-tag.model'),
  PlageIntervention = require('../../models/plage.model');

module.exports = {

  notify: function(intervention) {

    var DemandeParticipation = require('../../models/demande-participation.model');

    return InterventionTags.populate(intervention, {
      path: 'tags',
      select: 'name',
      lean: true,
    }).then(function(intervention) {
      return PlageIntervention.populate(intervention, {
        path: 'plage',
        select: 'date etablissement',
        populate: {
          path: 'etablissement',
          select: 'name coordinates notes.public',
          lean: true
        }
      }).then(function(intervention) {

        return DemandeParticipation
          .find({
            intervention: {
              $in: intervention._id
            },
            accepted: true,
            confirmed: true
          })
          .populate({
            path: 'benevole',
            populate: {
              path: 'role',
              select: 'description',
              lean: true
            }
          })
          .then(function(demandesParticipation) {

            return notificationsService.notify({
              receivers: _.map(demandesParticipation, 'benevole'),
              subject: '[modifiée] ' + intervention.plage.etablissement.name + ' - ' + moment(intervention.date.start).format('LLL'),
              title: 'Confirmation de participation à une intervention',
              transmittersConfig: {
                mail: path.join(__dirname, 'templates/mail/confirmation-intervention.nunjucks')
              },
              data: {
                intervention: _.assign(intervention, {
                  participants: _.map(demandesParticipation, 'benevole'),
                  etablissement: intervention.plage.etablissement
                })
              }
            });
          });
      });
    });
  }
};

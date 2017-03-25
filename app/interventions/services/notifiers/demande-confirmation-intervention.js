'use strict';

var _ = require('lodash'),
  q = require('q'),
  path = require('path'),
  config = require(path.join(require('app-root-path').toString(), 'config', 'config.js')),
  moment = require('moment'),
  notificationsService = require('../../../notifications'),
  Intervention = require('../../models/intervention.model'),
  DemandeParticipation = require('../../models/demande-participation.model'),
  ConversationService = require('../../../conversations/services/conversation.service'),
  Benevole = require('../../../benevoles/models/benevole.model');

function getIntervention(interventionId) {
  return Intervention
    .findById(interventionId)
    .select('date.start plage date tags local lieuRencontre responsableGroupe')
    .lean()
    .populate([{
      path: 'tags',
      select: 'name',
      lean: true
    }, {
      path: 'plage',
      select: 'etablissement',
      lean: true,
      populate: {
        path: 'etablissement',
        select: 'name coordinates notes.public',
        lean: true
      }
    }]);
}


function createConversation(demandeParticipation, user, subject, message) {
  return ConversationService.create({
    participants: [demandeParticipation.benevole, user._id],
    type: 'private',
    title: subject,
    message: message,
    attachements: [{
      type: 'message-attachement-intervention',
      data: {
        intervention: demandeParticipation.intervention
      }
    }]
  }, user);
}

function getDemandesParticipation(demandeParticipationId, interventionId) {
  return DemandeParticipation
    .find({
      _id: {
        $nin: demandeParticipationId
      },
      intervention: {
        $in: interventionId
      },
      accepted: true
    })
    .populate({
      path: 'benevole',
      select: 'prenom nomFamille role',
      lean: true,
      populate: {
        path: 'role',
        select: 'description',
        lean: true
      }
    })
    .lean()
}

module.exports = {

  notify: function(demandeParticipation, message, user) {

    return Benevole.populate(demandeParticipation, {
      path: 'benevole'
    }).then(function(demandeParticipation) {

      return getIntervention(demandeParticipation.intervention)
        .then(function(intervention) {

          var subject = 'Confirmation - ' + intervention.plage.etablissement.name + ' - ' + moment(intervention.date.start).format('LLL');

          return q.all([

            createConversation(demandeParticipation, user, subject, message),
            getDemandesParticipation(demandeParticipation._id, intervention._id)

          ]).then(function(results) {

            var data = {
              message: message,
              intervention: _.assign(intervention, {
                participants: _.map(_.last(results), 'benevole'),
                etablissement: intervention.plage.etablissement
              }),
              confirmLink: config.interventionAppUrl + 'conversations/' + _.first(results)._id
            }

            return notificationsService.notify({
              receiver: demandeParticipation.benevole,
              subject: subject,
              title: 'Demande de confirmation de participation à une intervention',
              transmittersConfig: {
                mail: path.join(__dirname, 'templates/mail/demande-confirmation-intervention.nunjucks')
              },
              data: data
            });
          });
        });
    });
  }
};

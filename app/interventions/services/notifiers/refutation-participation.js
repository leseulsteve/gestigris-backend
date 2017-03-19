'use strict';

var path = require('path'),
  moment = require('moment'),
  notificationsService = require('../../../notifications'),
  PlageIntervention = require('../../models/plage.model');

module.exports = {

  notify: function(intervention, demandeParticipation) {

    return PlageIntervention.populate(intervention, {
      path: 'plage',
      select: 'etablissement',
      populate: {
        path: 'etablissement',
        select: 'name',
        lean: true
      }
    }).then(function(intervention) {

      return notificationsService.notify({
        receiver: demandeParticipation.benevole,
        subject: intervention.plage.etablissement.name + ' - ' + moment(intervention.date.start).format('LLL'),
        title: 'Réfutation de participation à une intervention',
        transmittersConfig: {
          mail: path.join(__dirname, 'templates/mail/refutation-intervention.nunjucks')
        },
        data: {
          intervention: intervention,
          etablissement: intervention.plage.etablissement
        }
      });

    });
  }
};

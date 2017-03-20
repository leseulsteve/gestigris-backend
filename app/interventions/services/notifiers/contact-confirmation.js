'use strict';

var _ = require('lodash'),
  moment = require('moment'),
  path = require('path'),
  notificationsService = require('../../../notifications'),
  PlageIntervention = require('../../models/plage.model');

module.exports = {

  notify: function(plage) {

    return PlageIntervention.populate(plage, [{
      path: 'etablissement',
      select: 'name',
      lean: true
    }, {
      path: 'contact',
    }]).then(function(plage) {

      return notificationsService.notify({
        receiver: plage.contact,
        subject: plage.etablissement.name + ' - ' + moment(plage.date).format('LL'),
        title: 'Confirmation de la présence du GRIS-QC dans votre milieu',
        transmittersConfig: {
          mail: path.join(__dirname, 'templates/mail/contact-confirmation.nunjucks')
        },
        data: {
          etablissement: plage.etablissement,
          plage: plage
        }
      }).then(function(results) {
        _.assign(plage, {
          contactNotified: true
        }).save();
        return results;
      });
    });
  }
};

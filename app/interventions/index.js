'use strict';

var CronJob = require('cron').CronJob,
  moment = require('moment'),
  PlageIntervention = require('./models/plage.model'),
  ContactConfirmation = require('./services/notifiers/contact-confirmation');

new CronJob('00 00 06 * * *', function() { // Tous les jours à 6hrs
  PlageIntervention.find({
      date: {
        $lte: moment().endOf('day').add(72, 'hours')
      },
      status: 'CLOSE',
      contactNotified: false
    })
    .then(function(plages) {
      plages.forEach(function(plage) {
        console.log('CRON-SENDING', plage._id);
        ContactConfirmation
          .notify(plage)
          .then(function() {
            console.log('CRON-SENT', plage._id);
          })
          .catch(function(error) {
            console.error('CRON-ERROR', plage._id, error);
          });
      });
    });
}, null, true);

module.exports = {
  plageIntervention: require('./services/plage-intervention.service'),
  intervention: require('./services/intervention.service'),
  interventionTag: require('./services/intervention-tag.service'),
  demandeParticipation: require('./services/demande-participation.service'),
  //responsableGroupe: require('./services/responsable-groupe.service')
};

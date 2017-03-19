'use strict';

var config = require('./config/config'),
  chalk = require('chalk'),
  expressBase = require('express-base'),
  userAuth = require('express-user-auth'),
  mongoose = require('mongoose'),
  path = require('path'),
  nodemailer = require('nodemailer'),
  _ = require('lodash'),
  User = require('./app/models/user'),
  crudRouter = require('./app/core/services/crud-router');

var moment = require('moment');
moment.locale('fr');

expressBase.init(config.expressBase, function(app, express) {

  mongoose.connect(config.mongoose.URI);
  mongoose.Promise = require('q').Promise;

  var mailer = nodemailer.createTransport(config.mailer);

  expressBase.setMailerService(mailer);

  expressBase.getGlobbedFiles('./app/models/*.js').concat(expressBase.getGlobbedFiles('./app/**/models/*.js')).forEach(function(modelPath) {
    require(path.resolve(modelPath));
  });

  userAuth.init(app, require('./app/models/user'), config.expressUserAuth, mailer);

  var socketFactory = require('./app/socket/socket-factory')(app, config);

  /*socketFactory.initSocket('api/v1/intervention', function(socket) {
    app.use('/api/v1/plage-intervention', require('./app/interventions')(express.Router(), socket));
  });*/

  /*  socketFactory.initSocket('api/v1/conversation', function(socket) {
      app.use('/api/v1/conversation', require('./app/conversations')(express.Router(), socket));
    });*/

  var conversationModule = require('./app/conversations');
  app.use('/api/v1/conversation', new crudRouter(express, conversationModule.conversation));
  app.use('/api/v1/message', new crudRouter(express, conversationModule.message));

  var interventionModule = require('./app/interventions');
  app.use('/api/v1/plage-intervention', new crudRouter(express, interventionModule.plageIntervention));
  app.use('/api/v1/intervention', new crudRouter(express, interventionModule.intervention));
  app.use('/api/v1/intervention-tag', new crudRouter(express, interventionModule.interventionTag));
  app.use('/api/v1/demande-participation', new crudRouter(express, interventionModule.demandeParticipation));
  app.use('/api/v1/responsable-groupe', new crudRouter(express, interventionModule.responsableGroupe));

  app.use('/api/v1/etablissement', new crudRouter(express, require('./app/etablissements')));
  app.use('/api/v1/etablissement-type', new crudRouter(express, require('./app/etablissement-types')));
  app.use('/api/v1/commission-scolaire', new crudRouter(express, require('./app/commission-scolaire')));

  app.use('/api/v1/benevole', new crudRouter(express, require('./app/benevoles')));
  app.use('/api/v1/benevole-role', new crudRouter(express, require('./app/benevole-roles')));

  var adresseModule = require('./app/adresse');
  app.use('/api/v1/adresse/ville', new crudRouter(express, adresseModule.ville));
  app.use('/api/v1/adresse/province', new crudRouter(express, adresseModule.province));
  app.use('/api/v1/adresse/telephone', new crudRouter(express, adresseModule.telephone));

  app.use('/api/v1/contact', new crudRouter(express, require('./app/contacts')));
  app.use('/api/v1/poste', new crudRouter(express, require('./app/postes')));


  //app.use('/api/v1/notification', require('./app/notifications')(express.Router()));

  console.log(chalk.green.bgBlue.bold(config.appTitle + ' serveur écoute maintenant sur le port ' + config.expressBase.port));

});

'use strict';

var _ = require('lodash'),
  q = require('q'),
  User = require('../models/user'),
  transmitters = require('./transmitters');
//var notificationConfigController = require('./controllers/notification-config.controller.js');




module.exports = {
  // user
  // users
  // global
  // groups
  notify: function(params) {

    function notifyTransmitters(config) {
      return q.all(_.map(params.transmittersConfig, function(templatePath, transmitterName) {
        return transmitters[transmitterName].notify(_.assign(config, {
          subject: params.subject,
          title: params.title,
          templatePath: templatePath,
          data: params.data
        })).then(function(results) {
          return {
            transmitterName: transmitterName,
            results: results
          };
        });
      }));
    }

    if (params.receiver) {
      return User.findById(params.receiver).then(function(user) {
        notifyTransmitters({
          receiver: user
        });
      });
    }

    if (params.receivers) {
      return User.find({
        _id: {
          $in: params.receivers
        }
      }).then(function(users) {
        notifyTransmitters({
          receivers: users
        });
      });
    }
  }
};

/*module.exports = function(router, socket) {

  socket = socket;

  // <rootApi>/notifications
  router.route('/')

  .get(function(req, res) {
    notificationConfigController.find(req.query, req.user).then(function(notificationsConfig) {
      res.status(200).send(notificationsConfig);
    }).catch(function(error) {
      res.status(error.code).send(error.reason);
    });
  });

  router.route('/:notificationId')

  .put(function(req, res) {
    notificationConfigController.update(req.params.notificationId, req.user, req.body).then(function(notificationsConfig) {
      res.status(200).send(notificationsConfig);
    }).catch(function(error) {
      res.status(error.code).send(error.reason);
    });
  });

  return router;
};*/

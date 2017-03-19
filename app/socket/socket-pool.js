'use strict';

var _ = require('lodash');

var sockets = {
  interventions: [],
  messages: []
};

module.exports = {

  register: function(namespace, socket) {
    sockets[namespace].push(socket);
  },
  notify: function(namespace, eventName, data) {
    _.forEach(sockets[namespace], function(socket) {
      socket.emit(eventName, data);
    });
  },
  unregister: function(namespace, socket) {
    _.remove(sockets[namespace], function(currentSocket) {
      return currentSocket.id === socket.id;
    });
  }
};
'use strict';

var jwt = require('jsonwebtoken'),
  socketPool = require('./socket-pool');

module.exports = function(app, config) {

  var socketio = require('socket.io')(app.get('server'));

  var options = {
    secret: config.expressUserAuth.token.secret,
    timeout: 5000
  };

  return {

  initSocket : function (namespace, cb) {
      cb(socketio
        .of('sockets/' + namespace)
        .on('connection', function(socket) {
          delete socketio.sockets.connected[socket.id];

          var authTimeout = setTimeout(function() {
            socket.disconnect('unauthorized');
          }, options.timeout || 5000);

          var authenticate = function(data) {

            clearTimeout(authTimeout);
            jwt.verify(data.token, options.secret, options, function(err, decoded) {
              if (err) {
                socket.emit('unauthorized');
                socket.disconnect('unauthorized');
              }
              if (!err && decoded) {
                socketio.sockets.connected[socket.id] = socket;
                socket.decodedToken = decoded;
                socket.connectedAt = new Date();

                socket.on('disconnect', function() {
                  socketPool.unregister(namespace, socket);
                });

                socket.emit('authenticated');
                socketPool.register(namespace, socket);
              }
            });
          };
          socket.on('authenticate', authenticate);
        }));
    }
  };
};
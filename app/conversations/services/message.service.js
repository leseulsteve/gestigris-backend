'use strict';

var q = require('q'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Message = mongoose.model('message');

module.exports = {

  create: function(body, user) {
    var that = this;
    return Message.create(_.assign(body, {
        author: user._id,
        readBy: [user._id]
      }))
      .then(function(message) {
        if (_.isArray(message)) {
          return that.find({
            _id: {
              $in: _.map(message, '_id')
            }
          });
        }
        return that.findById(message._id);
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
    return Message
      .find(query)
      .sort('-createdAt')
      .select('-__v -_type')
      .exec()
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        })
      });
  },

  remove: function(id) {
    return Message
      .findById(id)
      .then(function(demande) {
        return demande.remove();
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        })
      });
  }
};

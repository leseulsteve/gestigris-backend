'use strict';

var q = require('q'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Conversation = mongoose.model('conversation'),
  Message = mongoose.model('message');

module.exports = {

  create: function(params, user) {
    var that = this;

    return Conversation.create(params)
      .then(function(conversation) {
        return Message.create({
          author: user._id,
          conversation: conversation._id,
          body: params.message,
          readBy: [user._id]
        }).then(function() {
          return that.findById(conversation._id);
        });
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
    return Conversation
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

  update: function(id, params) {
    var that = this;
    return Conversation.findById(id)
      .then(function(plage) {
        return _.assign(plage, params)
          .save()
          .then(function() {
            return that.findById(id);
          })
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        })
      });
  }
};

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
          attachements: params.attachements,
          readBy: [user._id]
        }).then(function() {
          return that.findById(conversation._id, user);
        });
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        })
      });
  },

  findById: function(id, user) {
    return this.find({
      _id: id
    }, user).then(_.first);
  },

  find: function(query, user) {

    if (!_.isUndefined(query.archived)) {
      query.archivedFor = query.archived ? user._id : {
        $ne: user._id
      };
    }
    return Conversation
      .find(_.omit(query, 'archived'))
      .sort('-createdAt')
      .select('-__v -_type')
      .then(function(conversations) {
        return _.map(conversations, function(conversation) {
          return _.omit(conversation.setArchivedStatus(user).toObject(), 'archivedFor');
        });
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        })
      });
  },

  update: function(id, params, user) {
    var that = this;
    return Conversation.findById(id)
      .then(function(plage) {
        if (params.archived) {
          _.assign(plage, {
            archivedFor: _.uniqBy((plage.archivedFor || []).concat(user._id), function(userId) {
              return userId.toString();
            })
          });
        }
        return _.assign(plage, params)
          .save()
          .then(function() {
            return that.findById(id, user);
          })
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message || error
        })
      });
  }
};

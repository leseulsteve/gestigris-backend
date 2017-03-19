'use strict';

var q = require('q'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Intervention = mongoose.model('intervention');

module.exports = {

  create: function(body) {
    var that = this;
    return Intervention.create(body)
      .then(function(intervention) {
        return that.findById(intervention._id);
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
    return Intervention
      .find(query)
      .sort('date.start')
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
    return Intervention
      .findById(id)
      .then(function(intervention) {
        return _.assign(intervention, params)
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
  },

  sendNotifications: function(notificationType, interventionId) {
    var notifier;
    try {
      notifier = require('./notifiers/' + notificationType);
    } catch (error) {
      console.error(error);
      return q.reject(notificationType + ' n\'est pas supporté');
    }
    return notifier.notify(interventionId);
  }
};

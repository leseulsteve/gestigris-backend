'use strict';

var q = require('q'),
  _ = require('lodash'),
  moment = require('moment'),
  mongoose = require('mongoose'),
  Plage = mongoose.model('plage-intervention'),
  Etablissement = mongoose.model('etablissement'),
  Conversation = mongoose.model('conversation');

module.exports = {

  create: function(params) {
    var that = this;

    return Etablissement
      .findById(params.etablissement)
      .select('name')
      .then(function(etablissement) {
        return Conversation
          .create({
            title: etablissement.name + ' - ' + moment(params.date).format('LL'),
            type: 'intervention'
          })
          .then(function(conversation) {

            return Plage
              .create(_.assign(params, {
                conversation: conversation
              }))
              .then(function(plage) {
                return that.findById(plage._id);
              });
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
    return Plage
      .find(query)
      .sort('date')
      .select('-__v -_type')
      .populate('etablissement contact')
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
    return Plage.findById(id)
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

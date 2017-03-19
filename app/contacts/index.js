'use strict';

var q = require('q'),
  _ = require('lodash'),
  Contact = require('mongoose').model('contact');

module.exports = {

  create: function(params) {
    var that = this;
    return Contact.create(params)
      .then(function(contact) {
        if (_.isArray(contact)) {
          return that.find({
            _id: {
              $in: _.map(contact, '_id')
            }
          });
        }
        return that.findById(contact._id);
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  find: function(query) {
    return Contact
      .find(query)
      .sort('lastname')
      .select('-__v -_type')
      .populate('poste')
      .exec()
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  findById: function(contactId) {
    return Contact
      .findById(contactId)
      .select('-__v -_type')
      .populate('poste')
      .exec()
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  update: function(contactId, params) {
    var that = this;
    return Contact.findByIdAndUpdate(contactId, params)
      .then(function() {
        return that.findById(contactId);
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  remove: function(contactId) {
    return Contact.findByIdAndRemove(contactId)
      .exec()
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  }
};
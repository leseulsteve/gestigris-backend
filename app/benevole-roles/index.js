'use strict';

var q = require('q'),
  _ = require('lodash'),
  BenevoleRole = require('mongoose').model('benevole-role');

module.exports = {

  create: function(params) {
    var that = this;
    return BenevoleRole.create(params)
      .then(function(role) {
        if (_.isArray(role)) {
          return that.find({
            _id: {
              $in: _.map(role, '_id')
            }
          });
        }
        return that.findById(role._id);
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  find: function(query) {
    return BenevoleRole
      .find(query)
      .sort('description')
      .select('-__v -_type')
      .exec()
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  findById: function(roleId) {
    return BenevoleRole
      .findById(roleId)
      .select('-__v -_type')
      .exec()
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  update: function(benevoleRoleId, params) {
    var that = this;
    return BenevoleRole.findByIdAndUpdate(benevoleRoleId, params)
      .then(function() {
        return that.findById(benevoleRoleId);
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  remove: function(benevoleRoleId) {
    return BenevoleRole.findByIdAndRemove(benevoleRoleId)
    .exec()
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  }
};

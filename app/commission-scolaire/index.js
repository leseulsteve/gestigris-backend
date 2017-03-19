'use strict';

var q = require('q'),
  _ = require('lodash'),
  CommissionScolaire = require('mongoose').model('commission-scolaire');

module.exports = {

  create: function(params) {
    var that = this;
    return CommissionScolaire.create(params)
      .then(function(commission) {
        if (_.isArray(commission)) {
          return that.find({
            _id: {
              $in: _.map(commission, '_id')
            }
          });
        }
        return that.findById(commission._id);
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  find: function(query) {
    return CommissionScolaire
      .find(query)
      .sort('name')
      .select('-__v -_type')
      .exec()
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  findById: function(commissionId) {
    return this.find({
      _id: commissionId
    }).then(function(commissions) {
      return _.first(commissions);
    });
  },

  update: function(commissionId, params) {
    var that = this;
    return CommissionScolaire.findByIdAndUpdate(commissionId, params)
      .then(function() {
        return that.findById(commissionId);
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  remove: function(commissionId) {
    return CommissionScolaire.findByIdAndRemove(commissionId)
    .exec()
    .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  }
};
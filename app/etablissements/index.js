'use strict';

var q = require('q'),
  _ = require('lodash'),
  Etablissement = require('mongoose').model('etablissement');

module.exports = {

  create: function(params) {
    var that = this;
    return Etablissement.create(params)
      .then(function(etablissement) {
        if (_.isArray(etablissement)) {
          return that.find({
            _id: {
              $in: _.map(etablissement, '_id')
            }
          });
        }
        return that.findById(etablissement._id);
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  find: function(query) {
    return Etablissement
      .find(query)
      .populate({
        path: 'type',
        select: 'name'
      })
      .sort('normalisedName')
      .select('-__v -_type')
      .exec()
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  findById: function(etablissementId) {
    return Etablissement
      .findById(etablissementId)
      .populate([{
        path: 'type',
        select: 'name'
      }, {
        path: 'address.city',
        select: 'name'
      }, {
        path: 'address.province',
        select: 'name'
      }, {
        path: 'commissionScolaire',
        select: 'name'
      }])
      .select('-__v -_type')
      .exec()
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  update: function(id, params) {
    var that = this;
    return Etablissement.findById(id)
      .then(function(etablissement) {
        return _.assign(etablissement, params)
          .save()
          .then(function() {
            return that.findById(id);
          });
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  remove: function(etablissementId) {
    return Etablissement.findByIdAndRemove(etablissementId)
      .exec()
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  }
};

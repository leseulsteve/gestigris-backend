'use strict';

var q = require('q'),
  _ = require('lodash'),
  EtablissementType = require('mongoose').model('etablissementtype');

module.exports = {

  create: function(params) {
    var that = this;
    return EtablissementType.create(params)
      .then(function(etablissementtype) {
        if (_.isArray(etablissementtype)) {
          return that.find({
            _id: {
              $in: _.map(etablissementtype, '_id')
            }
          });
        }
        return that.findById(etablissementtype._id);
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  find: function(query) {
    return EtablissementType
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

  findById: function(etablissementTypeId) {
    return EtablissementType
      .findById(etablissementTypeId)
      .select('-__v -_type')
      .exec()
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  update: function(etablissementTypeId, params) {
    var that = this;
    return EtablissementType.findByIdAndUpdate(etablissementTypeId, params)
      .then(function() {
        return that.findById(etablissementTypeId);
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  remove: function(etablissementTypeId) {
    return EtablissementType.findByIdAndRemove(etablissementTypeId)
      .exec()
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  }
};
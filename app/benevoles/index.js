'use strict';

var q = require('q'),
  _ = require('lodash'),
  Benevole = require('mongoose').model('benevole');

module.exports = {

  create: function(params) {
    var that = this;
    return Benevole.create(params)
      .then(function(benevole) {
        return that.findById(benevole._id);
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  findById: function(benevoleId) {
    return this.find({
      _id: benevoleId
    }).then(_.first);
  },

  find: function(query) {
    return Benevole
      .find(query)
      .populate({
        path: 'role',
        select: 'description'
      })
      .sort('normalisedFirstName')
      .select('-__v -_type -salt -password -searchField -normalisedFirstName')
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
    return Benevole.findById(id)
      .then(function(benevole) {
        return _.assign(benevole, params)
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

  remove: function(benevoleId) {
    return Benevole.findByIdAndRemove(benevoleId)
      .exec()
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  }
};

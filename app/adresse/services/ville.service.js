'use strict';

var q = require('q'),
  _ = require('lodash'),
  Ville = require('mongoose').model('ville');

module.exports = {

  create: function(params) {
    var that = this;
    return Ville.create(params)
      .then(function(ville) {
        if (_.isArray(ville)) {
          return that.find({
            _id: {
              $in: _.map(ville, '_id')
            }
          });
        }
        return that.find({
          _id: ville._id
        }).then(_.first);
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        })
      });
  },

  find: function(query) {
    return Ville
      .find(query)
      .sort('name')
      .select('-__v -_type')
      .exec()
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        })
      });
  }
};

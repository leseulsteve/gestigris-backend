'use strict';

var q = require('q'),
  _ = require('lodash'),
  Poste = require('mongoose').model('poste');

module.exports = {

  create: function(params) {
    var that = this;
    return Poste.create(params)
      .then(function(poste) {
        if (_.isArray(poste)) {
          return that.find({
            _id: {
              $in: _.map(poste, '_id')
            }
          });
        }
        return that.find({
          _id: poste._id
        }).then(_.first);
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        });
      });
  },

  find: function(query) {
    return Poste
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
  }
};

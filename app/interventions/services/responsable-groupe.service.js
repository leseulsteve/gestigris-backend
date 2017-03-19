'use strict';

var q = require('q'),
  _ = require('lodash'),
  Responsable = require('mongoose').model('responsable-groupe');

module.exports = {

  create: function(body) {
    var that = this;
    return Responsable.create(body)
      .then(function(responsable) {
        if (_.isArray(responsable)) {
          return that.find({
            _id: {
              $in: _.map(responsable, '_id')
            }
          });
        }
        return that.findById(responsable._id);
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
      .sort('nomComplet')
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

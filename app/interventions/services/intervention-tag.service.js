'use strict';

var q = require('q'),
  _ = require('lodash'),
  Tag = require('mongoose').model('intervention-tag');

module.exports = {

  create: function(body) {
    var that = this;
    return Tag.create(body)
      .then(function(tag) {
        if (_.isArray(tag)) {
          return that.find({
            _id: {
              $in: _.map(tag, '_id')
            }
          });
        }
        return that.findById(tag._id);
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
    return Tag
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
  },

  remove: function(id) {
    return Demande
      .findById(id)
      .then(function(demande) {
        return demande.remove();
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        })
      });
  }
};

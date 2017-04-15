'use strict';

var q = require('q'),
  _ = require('lodash'),
  moment = require('moment'),
  mongoose = require('mongoose'),
  ConfigSchema = require('../models/config');

module.exports = {

  create: function(params, user) {
    var that = this;
    return ConfigSchema
      .create(params)
      .then(function(config) {
        return that.findById(config._id);
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
    return ConfigSchema
      .find(query)
      .exec()
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        })
      });
  },

  update: function(id, params) {
    var that = this;
    return ConfigSchema.findById(id)
      .then(function(config) {
        return _.assign(config, params)
          .save()
          .then(function() {
            return that.findById(id);
          });
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        })
      });
  },

  remove: function(id) {
    return ConfigSchema
      .findById(id)
      .then(function(config) {
        return config.remove();
      })
      .catch(function(error) {
        return q.reject({
          code: 400,
          reason: error.message
        })
      });
  }
};

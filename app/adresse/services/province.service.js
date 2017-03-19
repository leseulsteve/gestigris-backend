'use strict';

var q = require('q'),
	_ = require('lodash'),
	Province = require('mongoose').model('province');

module.exports = {

	create: function(body) {
		var that = this;
		return Province.create(body)
			.then(function(province) {
				if (_.isArray(province)) {
					return that.find({
						_id: {
							$in: _.map(province, '_id')
						}
					});
				}
				return that.findById(province._id);
			})
			.catch(function(error) {
				return q.reject({
					code: 400,
					reason: error.message
				})
			});
	},

	find: function(query) {
		return Province
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
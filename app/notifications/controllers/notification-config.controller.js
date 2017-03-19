'use strict';

var mongoose = require('mongoose'),
	q = require('q'),
	_ = require('lodash'),
	NotificationConfig = mongoose.model('notification-config');

module.exports = {

	find: function(query, user) {

		var deffered = q.defer();

		NotificationConfig.find(_.assign(query, {
			user: user._id
		}), function(error, notificationConfig) {
			return error ? deffered.reject({
				code: 400,
				reason: error.message || error.errmsg
			}) : deffered.resolve(notificationConfig);
		});

		return deffered.promise;
	},

	update: function(nofiticationConfigId, user, params) {

		var deffered = q.defer();

		NotificationConfig.findById(nofiticationConfigId,
			function(error, notificationConfig) {

				if (error) {
					return deffered.reject({
						code: 400,
						reason: error.message || error.errmsg
					});
				}

				_.assign(notificationConfig, params);

				notificationConfig.save(function(error, notificationConfig) {
					return error ? deffered.reject({
						code: 400,
						reason: error.message || error.errmsg
					}) : deffered.resolve(notificationConfig);
				});
			});

		return deffered.promise;
	}
};
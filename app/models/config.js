'use strict';

var mongoose = require('mongoose'),
	ExpressBase = require('express-base'),
	_ = require('lodash');
	require('mongoose-schema-extend');

var ConfigSchema = ExpressBase.getBaseSchema().extend({
	name: {
		type: String
	},
	data: {
		type: String
	}
});

ConfigSchema.statics.can = function(operation, user) {
	return _.intersection(user.roles, ['admin']).length > 0;
};

module.exports = mongoose.model('config', ConfigSchema);
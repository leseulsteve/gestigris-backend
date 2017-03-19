'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	timestamps = require('mongoose-timestamp');

var BenevoleRoleSchema = new Schema({
	description: {
		type: String,
		trim: true,
		required: true
	},
	code: {
		type: String
	}
});

BenevoleRoleSchema.plugin(timestamps);

module.exports = mongoose.model('benevole-role', BenevoleRoleSchema);

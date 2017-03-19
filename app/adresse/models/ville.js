'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	timestamps = require('mongoose-timestamp');

var VilleSchema = new Schema({
	name: {
		type: String
	}
});

VilleSchema.plugin(timestamps);

module.exports = mongoose.model('ville', VilleSchema);
'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	timestamps = require('mongoose-timestamp');

var PosteSchema = new Schema({
	description: {
		type: String,
		required: 'La description est requise'
	}
});

PosteSchema.plugin(timestamps);

module.exports = mongoose.model('poste', PosteSchema);
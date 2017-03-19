'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	timestamps = require('mongoose-timestamp');

var EtablissementTypeSchema = new Schema({
	name: {
		type: String,
		required: 'Le nom est requis'
	}
});

EtablissementTypeSchema.plugin(timestamps);

module.exports = mongoose.model('etablissementtype', EtablissementTypeSchema);
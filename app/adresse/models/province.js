'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	timestamps = require('mongoose-timestamp');

var ProvinceSchema = new Schema({
	name: {
		type: String
	}
});

ProvinceSchema.plugin(timestamps);

module.exports = mongoose.model('province', ProvinceSchema);
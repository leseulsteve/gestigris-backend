'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	timestamps = require('mongoose-timestamp');

var CommissionSchema = new Schema({
	name: {
		type: String,
		trim: true,
		required: true
	}
});

CommissionSchema.plugin(timestamps);

module.exports = mongoose.model('commission-scolaire', CommissionSchema);
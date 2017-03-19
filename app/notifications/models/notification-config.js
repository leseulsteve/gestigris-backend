'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var NotificationConfigSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	intervention: {
		accepted: {
			type: Boolean,
			default: true
		},
		refused: {
			type: Boolean,
			default: true
		},
		confirmed: {
			type: Boolean,
			default: true
		},
		otherConfirmed: {
			type: Boolean,
			default: true
		}
	},
	messages: {
		equipe: {
			type: Boolean,
			default: true
		},
		intervention: {
			type: Boolean,
			default: true
		}
	}
});

module.exports = mongoose.model('notification-config', NotificationConfigSchema);
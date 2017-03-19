'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp');

var ConversationSchema = new Schema({
  participants: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  title: {
    type: String
  },
  type: {
    type: String
  },
  archived: {
    type: Boolean,
    default: false
  }
});

ConversationSchema.plugin(timestamps);

ConversationSchema.methods.addParticipants = function(participantIds) {
  return _.assign(this, {
    participants: _.uniqBy((this.participants || []).concat(participantIds), function(participantId) {
      return participantId.toString();
    })
  }).save();
};

ConversationSchema.methods.removeParticipant = function(participantId) {
  return _.assign(this, {
    participants: _.filter(this.participants, function(id) {
      return !id.equals(participantId);
    })
  }).save();
};

module.exports = mongoose.model('conversation', ConversationSchema);

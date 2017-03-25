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
  },
  archivedFor: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  searchField: {
    type: String
  }
});

ConversationSchema.plugin(timestamps);

ConversationSchema.methods.setArchivedStatus = function(user) {
  return _.assign(this, {
    archived: this.archivedFor.length ? _.filter(this.archivedFor, function(userId) {
      return userId.equals(user._id);
    }).length > 0 : false
  });
};

ConversationSchema.pre('save', function(next) {
  this.searchField = _.deburr(this.title).toLowerCase();
  next();
});

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

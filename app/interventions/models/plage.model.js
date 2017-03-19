'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp'),
  Conversation = mongoose.model('conversation');

var PlageSchema = new Schema({
  createdBy: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  etablissement: {
    type: Schema.ObjectId,
    ref: 'etablissement',
    required: true
  },
  contact: {
    type: Schema.ObjectId,
    ref: 'contact',
    required: true
  },
  conversation: {
    type: Schema.ObjectId,
    ref: 'conversation',
    required: true
  },
  tags: [{
    type: Schema.ObjectId,
    ref: 'intervention-tag'
  }],
  status: {
    type: String,
    emum: ['OPEN', 'CLOSE'],
    default: 'OPEN'
  },
  contactNotified: {
    type: Boolean,
    default: false
  }
});

PlageSchema.plugin(timestamps);

PlageSchema.methods.updateStatus = function(intervention) {
  var Intervention = require('./intervention.model'),
    plage = this;

  return Intervention
    .find({
      _id: {
        $ne: intervention._id
      },
      plage: plage._id
    })
    .select('status')
    .lean()
    .then(function(interventions) {
      return _.assign(plage, {
        status: _.filter(interventions.concat(intervention), ['status', 'OPEN']).length ? 'OPEN' : 'CLOSE'
      }).save();
    });
}

PlageSchema.methods.addParticipants = function(participantIds) {
  return Conversation.findById(this.conversation)
    .then(function(conversation) {
      conversation.addParticipants(participantIds);
    });
};

PlageSchema.methods.removeParticipant = function(participantId) {
  return Conversation.findById(this.conversation)
    .then(function(conversation) {
      conversation.removeParticipant(participantId);
    });
};

module.exports = mongoose.model('plage-intervention', PlageSchema);

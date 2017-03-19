'use strict';

'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp'),
  socketPool = require('../../socket/socket-pool');

var MessageSchema = new Schema({
  conversation: {
    type: Schema.ObjectId,
    ref: 'conversation'
  },
  author: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  body: {
    type: String
  },
  readBy: [{
    type: Schema.ObjectId,
    ref: 'User'
  }]
});

MessageSchema.plugin(timestamps);


MessageSchema.pre('save', function(next) {
  this.wasNew = this.isNew;
  if (this.isNew) {
    this.date = new Date();
  }
  next();
});

MessageSchema.post('save', function() {
  if (this.wasNew) {
    socketPool.notify('messages', 'created', this.toObject());
  }
});

module.exports = mongoose.model('message', MessageSchema);

'use strict';

var mongoose = require('mongoose'),
  UserAuth = require('express-user-auth');

require('mongoose-schema-extend');

var UserSchema = UserAuth.getSecureUserSchema().extend({
  prenom: {
    type: String,
    trim: true,
    required: true
  },
  nomFamille: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  title: {
    type: String
  },
  avatar: {
    type: String
  },
  actif: {
    type: Boolean,
    default: true
  }
});

UserSchema.methods.toString = function() {
  return this.prenom + ' ' + this.nomFamille;
};

UserSchema.methods.getEmail = function() {
  return this.email;
};

UserAuth.getSecureUserSchema().pre('save', function(next) {
  this.username = this.email;
  next();
});

module.exports = mongoose.model('User', UserSchema);

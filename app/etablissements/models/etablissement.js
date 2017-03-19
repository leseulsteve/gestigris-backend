'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp');

var EtablissementSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  normalisedName: {
    type: String
  },
  type: {
    type: Schema.ObjectId,
    ref: 'etablissementtype',
    required: true
  },
  commissionScolaire: {
    type: Schema.ObjectId,
    ref: 'commission-scolaire'
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: Schema.ObjectId,
      ref: 'ville',
      required: true
    },
    province: {
      type: Schema.ObjectId,
      ref: 'province',
      required: true
    },
    postalCode: {
      type: String,
      required: true
    }
  },
  telephones: [{
    no: {
      type: String,
      require: true
    },
    description: {
      type: String
    }
  }],
  coordinates: {
    lat: {
      type: Number
    },
    long: {
      type: Number
    }
  },
  osmId: {
    type: String
  },
  osmType: {
    type: String
  },
  placeId: {
    type: String
  },
  placeType: {
    type: String
  },
  notes: {
    admin: {
      type: String
    },
    public: {
      type: String
    }
  },
  searchField: {
    type: String
  }
});

EtablissementSchema.plugin(timestamps);

EtablissementSchema.pre('save', function(next) {
  this.searchField = _.deburr(this.name).toLowerCase();
  this.normalisedName = _.deburr(this.name).toLowerCase();
  next();
});

module.exports = mongoose.model('etablissement', EtablissementSchema);

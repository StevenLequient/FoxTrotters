'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Plant Schema
 */
var PlantSchema = new Schema({
  commonName: {
    type: String,
    default: '',
    required: 'Please fill Plant name',
    trim: true
  }, latinName: {
    type: String,
    default: '',
    trim: true
  }, family: {
    type: String,
    default: '',
    trim: true
  }, genre: {
    type: String,
    default: '',
    trim: true
  }, uses: [{
    type: Schema.ObjectId,
    ref: 'Use',
    default: []
  }], pois: [{
    type: Schema.ObjectId,
    ref: 'Poi',
    default: []
  }],
  image: {
    type: [String],
    default: ['modules/plants/client/img/errorIcon.svg']
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Plant', PlantSchema);

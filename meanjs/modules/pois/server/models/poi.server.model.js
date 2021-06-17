'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Poi Schema
 */
var PoiSchema = new Schema({
  // Poi model fields
  // ...
  name: {
    type: String,
    default: '',
    required: 'Please fill Poi name',
    trim: true
  },
  desc: {
    type: String,
    default: '',
    required: 'Please fill Poi desc',
    trim: true
  },
  coords: {
    longitude: {
      type: Number,
      required: 'Please fill Poi longitude'
    },
    latitude: {
      type: Number,
      required: 'Please fill Poi latitude'
    }
  },
  icon: {
    type: String,
    default: './images/default-marker.jpg'
  },
  fillcolor: {
    type: String,
    default: '009900'
  },
  strokecolor: {
    type: String,
    default: '000000'
  },
  labelcolor: {
    type: String,
    default: '000000'
  },
  label: {
    type: String,
    default: ''
  },
  typep: {
    type: String
  },
  image: {
    type: String,
    default: './images/default.jpg'
  },
  people: {
    type: Number,
    default: Math.floor(Math.random() * 1000)
  },
  plant: {
    type: Schema.ObjectId,
    ref: 'Plant'
  },
  panorama: {
    type: Schema.ObjectId
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  dangerzone: {
    type: String,
    default: '0'
  },
  score: {
    type: Number,
    default: 0
  }

});

mongoose.model('Poi', PoiSchema);

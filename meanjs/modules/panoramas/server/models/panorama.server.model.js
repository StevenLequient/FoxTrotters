'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Use Schema
 */

var Annotation = new Schema({
  x: {
    type: Number,
    required: 'set x position'
  },
  y: {
    type: Number,
    required: 'set y position'
  },
  note: {
    type: String,
    required: 'set note'
  }
});

var PanoramaSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  image: {
    type: String,
    required: 'please set an image'
  },
  width: {
    type: Number,
    required: 'please add img width'
  },
  height: {
    type: Number,
    required: 'please add img height'
  },
  annotation: {
    type: [Annotation],
    required: 'please add at least one annotation'
  }
});

mongoose.model('Panorama', PanoramaSchema);

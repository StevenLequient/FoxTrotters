'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Plander Schema
 */
var PlanderSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  helper: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  plant: {
    type: Schema.ObjectId,
    ref: 'Plant'
  },
  image: {
    type: String,
    required: 'Please add an image'
  },
  originalAuthor: {
    type:String
  },
  isPlantnet: {
    type: Boolean,
    default: false
  },
  askCommunity: {
    type: Boolean,
    default: false
  }

});

mongoose.model('Plander', PlanderSchema);

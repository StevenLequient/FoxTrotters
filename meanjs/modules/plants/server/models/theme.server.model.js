'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Theme Schema
 */
var ThemeSchema = new Schema({
  icon: {
    type: String,
    default: 'modules/plants/client/img/errorIcon.svg'
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill theme name',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Theme', ThemeSchema);

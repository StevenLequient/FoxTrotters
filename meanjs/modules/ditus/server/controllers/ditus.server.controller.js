'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Ditu = mongoose.model('Ditu'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Ditu
 */
exports.create = function(req, res) {
  var ditu = new Ditu(req.body);
  ditu.user = req.user;
  console.log('saving ditu');
  ditu.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ditu);
    }
  });
};

/**
 * Show the current Ditu
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var ditu = req.ditu ? req.ditu.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  ditu.isCurrentUserOwner = req.user && ditu.user && ditu.user._id.toString() === req.user._id.toString();

  res.jsonp(ditu);
};

/**
 * Update a Ditu
 */
exports.update = function(req, res) {
  var ditu = req.ditu;

  ditu = _.extend(ditu, req.body);

  ditu.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ditu);
    }
  });
};

/**
 * Delete an Ditu
 */
exports.delete = function(req, res) {
  var ditu = req.ditu;

  ditu.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ditu);
    }
  });
};

/**
 * List of Ditus
 */
exports.list = function(req, res) {
  Ditu.find().sort('-created').populate('user', 'displayName').exec(function(err, ditus) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ditus);
    }
  });
};

/**
 * Ditu middleware
 */
exports.dituByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Ditu is invalid'
    });
  }

  Ditu.findById(id).populate('user', 'displayName').exec(function (err, ditu) {
    if (err) {
      return next(err);
    } else if (!ditu) {
      return res.status(404).send({
        message: 'No Ditu with that identifier has been found'
      });
    }
    req.ditu = ditu;
    next();
  });
};

'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Poi = mongoose.model('Poi'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Poi
 */
exports.create = function(req, res) {
  var poi = new Poi(req.body);
  poi.user = req.user;

  poi.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(poi);
    }
  });
};

/**
 * Show the current Poi
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var poi = req.poi ? req.poi.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  poi.isCurrentUserOwner = req.user && poi.user && poi.user._id.toString() === req.user._id.toString();

  res.jsonp(poi);
};

/**
 * Update a Poi
 */
exports.update = function(req, res) {
  var poi = req.poi;

  poi = _.extend(poi, req.body);

  poi.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(poi);
    }
  });
};

/**
 * Delete an Poi
 */
exports.delete = function(req, res) {
  var poi = req.poi;

  poi.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(poi);
    }
  });
};

/**
 * List of Pois
 */
exports.list = function(req, res) {
  Poi.find().sort('-created').populate('user', 'displayName').exec(function(err, pois) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pois);
    }
  });
};

/**
 * Poi vote positif
 */

exports.voteP = function (req, res) {
  var poi = req.poi;
  console.log(poi);

  poi.score++;
  poi = _.extend(poi, req.body);
  poi.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(poi);
    }
  });
};

/**
 * Poi vote negatif
 */

exports.voteM = function (req, res) {
  var poi = req.poi;
  poi.score--;
  poi = _.extend(poi, req.body);
  poi.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(poi);
    }
  });
};

/**
 * Poi middleware
 */
exports.poiByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Poi is invalid'
    });
  }

  Poi.findById(id).populate('user', 'displayName').exec(function (err, poi) {
    if (err) {
      return next(err);
    } else if (!poi) {
      return res.status(404).send({
        message: 'No Poi with that identifier has been found'
      });
    }
    req.poi = poi;
    next();
  });
};


'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Use = mongoose.model('Use'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  Theme = mongoose.model('Theme');// ,
  // Q = require('Q');

/**
 * Create a Use
 */
function saveUse(use, res, prom) {
  use.save(function (err) {
    if (err) {
      if (res) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      if (prom) {
        prom.reject(err);
      }
    } else {
      if (res)
        res.jsonp(use);
      if (prom) {
        console.log('okuse');
        console.log(use);
        prom.resolve(use);
      }
    }
  });
}

exports.create = function (req, res) {
  var use = new Use(req.body);
  use.user = req.user;
  var prom = Promise.defer();

  if (req.body.theme !== undefined && !mongoose.Types.ObjectId.isValid(req.body.theme) && !mongoose.Types.ObjectId.isValid(req.body.theme.id)) {

    // créer le theme

    var theme = new Theme(req.body.theme);

    theme.save(function (err) {
      if (err) {
        if (!res) {
          prom.reject(err);
        } else {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }

      } else {
        use.theme = theme.id;

        console.log('ok th');
        saveUse(use, res, prom);
      }
    });

  } else {
    saveUse(use, res, prom);
  }
  return prom.promise;
};

/**
 * Show the current Use
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var use = req.use ? req.use.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  use.isCurrentUserOwner = req.user && use.user && use.user._id.toString() === req.user._id.toString();

  res.jsonp(use);
};

/**
 * Update a Use
 */
exports.update = function (req, res) {
  var use = req.use;

  use = _.extend(use, req.body);

  use.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(use);
    }
  });
};

/**
 * Delete an Use
 */
exports.delete = function (req, res) {
  var use = req.use;

  use.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(use);
    }
  });
};

/**
 * List of Uses
 */
exports.list = function (req, res) {
  Use.find().sort('-created').populate('user', 'displayName').exec(function (err, uses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(uses);
    }
  });
};

/**
 * Use middleware
 */
exports.useByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Use is invalid'
    });
  }

  Use.findById(id).populate('user', 'displayName').populate('theme').exec(function (err, use) {
    if (err) {
      return next(err);
    } else if (!use) {
      return res.status(404).send({
        message: 'No Use with that identifier has been found'
      });
    }
    req.use = use;
    next();
  });
};

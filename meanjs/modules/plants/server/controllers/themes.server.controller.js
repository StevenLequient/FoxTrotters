'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Theme = mongoose.model('Theme'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Theme
 */
exports.create = function (req, res) {
  var theme = new Theme(req.body);
  theme.user = req.user;

  theme.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (res)
        res.jsonp(theme);
    }
  });
};

/**
 * Show the current Theme
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var theme = req.theme ? req.theme.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  theme.isCurrentUserOwner = req.user && theme.user && theme.user._id.toString() === req.user._id.toString();

  res.jsonp(theme);
};

/**
 * Update a Theme
 */
exports.update = function (req, res) {
  var theme = req.theme;

  theme = _.extend(theme, req.body);

  theme.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(theme);
    }
  });
};

/**
 * Delete an Theme
 */
exports.delete = function (req, res) {
  var theme = req.theme;

  theme.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(theme);
    }
  });
};

/**
 * List of Themes
 */
exports.list = function (req, res) {
  Theme.find().sort('-created').populate('user', 'displayName').exec(function (err, themes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(themes);
    }
  });
};

/**
 * Theme middleware
 */
exports.themeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Theme is invalid'
    });
  }

  Theme.findById(id).populate('user', 'displayName').exec(function (err, theme) {
    if (err) {
      return next(err);
    } else if (!theme) {
      return res.status(404).send({
        message: 'No Theme with that identifier has been found'
      });
    }
    req.theme = theme;
    next();
  });
};

'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Plant = mongoose.model('Plant'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  uses = require('../controllers/uses.server.controller');// ,
 // Q = require('Q');


function plantSave(plant, res) {
  plant.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(plant);
    }
  });
}

/**
 * Create a Plant
 */
exports.create = function (req, res) {
  var waitUses = [];
  var waitUsesIds = [];

  // vérifier que les usages existent
  for (var us in req.body.uses) {
    if (!mongoose.Types.ObjectId.isValid(req.body.uses[us].id)) {
      // créer le use
      console.log('creating use');
      var reqt = { 'body': req.body.uses[us], 'user': req.user };
      waitUses.push(uses.create(reqt));
      waitUsesIds.push(us);
    }
  }

  Promise.all(waitUses).then(function (values) {
    for (var us2 = 0; us2 < values.length; us2++) {
      console.log('Us2: ' + us2 + ' ' + waitUsesIds[us2]);
      console.log(values[us2]);
      req.body.uses[waitUsesIds[us2]] = values[us2];
    }
    var plant = new Plant(req.body);

    plant.user = req.user;
    plantSave(plant, res);

  }, function (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });


};

/**
 * Show the current Plant
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var plant = req.plant ? req.plant.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  // plant.isCurrentUserOwner = req.user && plant.user && plant.user._id.toString() === req.user._id.toString();

  res.jsonp(plant);
};

/**
 * Update a Plant
 */
exports.update = function (req, res) {
  var plant = req.plant;

  plant = _.extend(plant, req.body);

  plant.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(plant);
    }
  });
};

/**
 * Delete an Plant
 */
exports.delete = function (req, res) {
  var plant = req.plant;

  plant.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(plant);
    }
  });
};

/**
 * List of Plants
 */
exports.list = function (req, res) {
  Plant.find().sort('-created').populate('user', 'displayName').exec(function (err, plants) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(plants);
    }
  });
};

/**
 * Plant middleware
 */
exports.plantByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Plant is invalid'
    });
  }

  Plant.findById(id)
    .populate({
      path: 'uses',
      populate: { path: 'theme', model: 'Theme' }
    })
    .populate('user', 'displayName')
    .exec(function (err, plant) {
      if (err) {
        return next(err);
      } else if (!plant) {
        return res.status(404).send({
          message: 'No Plant with that identifier has been found'
        });
      }
      req.plant = plant;
      next();
    });
};

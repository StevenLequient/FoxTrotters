'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Plander = mongoose.model('Plander'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  crypto = require('crypto'),
  mime = require('mime'),
  http = require('http'),
  _ = require('lodash');

/**
 * Create a Plander
 */
exports.create = function (req, res) {
  var plander = new Plander(req.body);
  plander.user = req.user;

  plander.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(plander);
    }
  });
};

/**
 * Show the current Plander
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var plander = req.plander ? req.plander.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  plander.isCurrentUserOwner = req.user && plander.user && plander.user._id.toString() === req.user._id.toString();

  res.jsonp(plander);
};

/**
 * Update a Plander
 */
exports.update = function (req, res) {
  var plander = req.plander;

  plander = _.extend(plander, req.body);

  plander.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(plander);
    }
  });
};

/**
 * Delete an Plander
 */
exports.delete = function (req, res) {
  var plander = req.plander;

  plander.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(plander);
    }
  });
};

/**
 * List of Planders
 */
exports.list = function (req, res) {
  Plander.find().sort('-created').populate('user', 'displayName').exec(function (err, planders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(planders);
    }
  });
};

/**
 * Plander middleware
 */
exports.planderByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Plander is invalid'
    });
  }

  Plander.findById(id).populate('user', 'displayName').exec(function (err, plander) {
    if (err) {
      return next(err);
    } else if (!plander) {
      return res.status(404).send({
        message: 'No Plander with that identifier has been found'
      });
    }
    req.plander = plander;
    next();
  });
};

/**
 * Upload a plant picture
 */
exports.uploadPicture = function (req, res) {
  var user = req.user;
  console.log('hey');

  /*if (!user) {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }*/

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './modules/users/client/img/profile/uploads//');
    },
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
      });
    }
  });

  var upload = multer({
    storage: storage
  }).single('newProfilePicture');

  console.log('hey');
  upload(req, res, function (uploadError) {
    console.log('ho');

    if (uploadError) {
      return res.status(400).send({
        message: 'Error occurred while uploading plander picture' + uploadError
      });
    } else {
      console.log('ok2');
      var plander = new Plander();
      plander.image = '/modules/users/client/img/profile/uploads/' + req.file.filename;

      console.log(plander.image);

      if(user)
        plander.user = user;

      plander.save(function (saveError) {
        if (saveError) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(saveError)
          });
        } else {
          res.json(plander);
        }
      });
    }
  });

};

exports.getResults = function (req, res2) {
  var plander = req.plander;
  console.log(plander);

  var itl = 'http://' + req.headers.host + plander.image;

  //var itl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Leucanthemum_vulgare_qtl1.jpg/220px-Leucanthemum_vulgare_qtl1.jpg';
  var host = 'http://identify.plantnet-project.org';
  var pathAP =
    '/api/project/useful/identify?imgs=' + itl +
    '&tags=flower&json=true&lang=en&app_version=web-1.0.0';

  http.get(host + pathAP, function(res) {

    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      console.log(body);
      res2.jsonp(body);
    });
  }).on('error', function(e) {
    console.log('Got error: ' + e.message);
    console.log(pathAP);
    res2.status(404).send({
      message: e.message
    });
  });
};

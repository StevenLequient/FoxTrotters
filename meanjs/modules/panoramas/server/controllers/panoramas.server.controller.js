'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Panorama = mongoose.model('Panorama'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  crypto = require('crypto'),
  mime = require('mime'),
  http = require('http'),
  _ = require('lodash');

/**
 * Create a Panorama
 */
exports.create = function (req, res) {
  var panorama = new Panorama(req.body);
  panorama.user = req.user;

  panorama.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(panorama);
    }
  });
};

/**
 * Show the current Panorama
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var panorama = req.panorama ? req.panorama.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  panorama.isCurrentUserOwner = req.user && panorama.user && panorama.user._id.toString() === req.user._id.toString();

  res.jsonp(panorama);
};

/**
 * Update a Panorama
 */
exports.update = function (req, res) {
  var panorama = req.panorama;

  panorama = _.extend(panorama, req.body);

  panorama.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(panorama);
    }
  });
};

/**
 * Delete an Panorama
 */
exports.delete = function (req, res) {
  var panorama = req.panorama;

  panorama.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(panorama);
    }
  });
};

/**
 * List of Panoramas
 */
exports.list = function (req, res) {
  Panorama.find().sort('-created').populate('user', 'displayName').exec(function (err, panoramas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(panoramas);
    }
  });
};

/**
 * Panorama middleware
 */
exports.panoramaByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Panorama is invalid'
    });
  }

  Panorama.findById(id).populate('user', 'displayName').exec(function (err, panorama) {
    if (err) {
      return next(err);
    } else if (!panorama) {
      return res.status(404).send({
        message: 'No Panorama with that identifier has been found'
      });
    }
    req.panorama = panorama;
    next();
  });
};

/**
 * Upload a panorama picture
 */
exports.uploadPicture = function (req, res) {
  var user = req.user;

  if (!user) {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './modules/users/client/img/profile/uploads/');
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
        message: 'Error occurred while uploading panorama picture' + uploadError
      });
    } else {
      console.log('ok2');
      var panorama = new Panorama();
      panorama.image = '/modules/users/client/img/profile/uploads/' + req.file.filename;

      console.log(panorama.image);

      panorama.user = user;

      panorama.save(function (saveError) {
        if (saveError) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(saveError)
          });
        } else {
          res.json(panorama);
        }
      });
    }
  });

};

exports.getResults = function (req, res2) {
  var panorama = req.panorama;
  console.log(panorama);

  // var itl = 'http://' + req.headers.host + panorama.image;

  var itl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Leucanthemum_vulgare_qtl1.jpg/220px-Leucanthemum_vulgare_qtl1.jpg';
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

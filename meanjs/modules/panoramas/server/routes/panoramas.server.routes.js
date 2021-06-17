'use strict';

/**
 * Module dependencies
 */
var panoramasPolicy = require('../policies/panoramas.server.policy'),
  panoramas = require('../controllers/panoramas.server.controller');

module.exports = function(app) {
  // Panoramas Routes
  app.route('/api/panoramas').all(panoramasPolicy.isAllowed)
    .get(panoramas.list)
    .post(panoramas.uploadPicture);

  app.route('/api/panoramas/:panoramaId').all(panoramasPolicy.isAllowed)
    .get(panoramas.read)
    .put(panoramas.update)
    .delete(panoramas.delete);

  app.route('/api/panoramas/result/:panoramaId')
    .get(panoramas.getResults);

  // Finish by binding the Panorama middleware
  app.param('panoramaId', panoramas.panoramaByID);
};

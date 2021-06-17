'use strict';

/**
 * Module dependencies
 */
var poisPolicy = require('../policies/pois.server.policy'),
  pois = require('../controllers/pois.server.controller');

module.exports = function(app) {
  // Pois Routes
  app.route('/api/pois').all(poisPolicy.isAllowed)
    .get(pois.list)
    .post(pois.create);

  app.route('/api/pois/:poiId').all(poisPolicy.isAllowed)
    .get(pois.read)
    .put(pois.update)
    .delete(pois.delete);

  app.route('/api/pois/:poiId/plus')
      .get(pois.voteP);

  app.route('/api/pois/:poiId/moins')
      .get(pois.voteM);
      

  // Finish by binding the Poi middleware
  app.param('poiId', pois.poiByID);
};

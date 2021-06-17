'use strict';

/**
 * Module dependencies
 */
var plantsPolicy = require('../policies/plants.server.policy'),
  plants = require('../controllers/plants.server.controller');

module.exports = function(app) {
  // Plants Routes
  app.route('/api/plants').all(plantsPolicy.isAllowed)
    .get(plants.list)
    .post(plants.create);

  app.route('/api/plants/:plantId').all(plantsPolicy.isAllowed)
    .get(plants.read)
    .put(plants.update)
    .delete(plants.delete);

  // Finish by binding the Plant middleware
  app.param('plantId', plants.plantByID);
};

'use strict';

/**
 * Module dependencies
 */
var ditusPolicy = require('../policies/ditus.server.policy'),
  ditus = require('../controllers/ditus.server.controller');

module.exports = function(app) {
  // Ditus Routes
  app.route('/api/ditus').all(ditusPolicy.isAllowed)
    .get(ditus.list)
    .post(ditus.create);

  app.route('/api/ditus/:dituId').all(ditusPolicy.isAllowed)
    .get(ditus.read)
    .put(ditus.update)
    .delete(ditus.delete);

  // Finish by binding the Ditu middleware
  app.param('dituId', ditus.dituByID);
};

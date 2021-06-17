'use strict';

/**
 * Module dependencies
 */
var usesPolicy = require('../policies/uses.server.policy'),
  uses = require('../controllers/uses.server.controller');

module.exports = function(app) {
  // Uses Routes
  app.route('/api/uses').all(usesPolicy.isAllowed)
    .get(uses.list)
    .post(uses.create);

  app.route('/api/uses/:useId').all(usesPolicy.isAllowed)
    .get(uses.read)
    .put(uses.update)
    .delete(uses.delete);

  // Finish by binding the Use middleware
  app.param('useId', uses.useByID);
};

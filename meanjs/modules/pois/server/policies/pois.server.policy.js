'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Pois Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/pois',
      permissions: '*'
    }, {
      resources: '/api/pois/:poiId',
      permissions: '*'
    }, {
      resources: '/api/pois/:poiId/plus',
      permissions: ['*']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/pois',
      permissions: ['get', 'post']
    }, {
      resources: '/api/pois/:poiId',
      permissions: ['get']
    }, {
      resources: '/api/pois/:poiId/plus',
      permissions: ['*']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/pois',
      permissions: ['*']
    }, {
      resources: '/api/pois/:poiId',
      permissions: ['*']
    }, {
      resources: '/api/pois/:poiId/plus',
      permissions: ['*']
    }]
  }]);
};

/**
 * Check If Pois Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Poi is being processed and the current user created it then allow any manipulation
  if (req.poi && req.user && req.poi.user && req.poi.user.id === req.user.id) {
    return next();
  };

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};

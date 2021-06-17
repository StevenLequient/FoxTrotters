// Pois service used to communicate Pois REST endpoints
(function () {
  'use strict';

  angular
    .module('pois')
    .factory('PoisService', PoisService);

  PoisService.$inject = ['$resource'];

  function PoisService($resource) {
    return $resource('/api/pois/:poiId', {
      poiId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

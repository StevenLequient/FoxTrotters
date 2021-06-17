// Plants service used to communicate Plants REST endpoints
(function () {
  'use strict';

  angular
    .module('plants')
    .factory('PlantsService', PlantsService);

  PlantsService.$inject = ['$resource'];

  function PlantsService($resource) {
    return $resource('/api/plants/:plantId', {
      plantId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

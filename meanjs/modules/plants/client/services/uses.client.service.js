// Uses service used to communicate Uses REST endpoints
(function () {
  'use strict';

  angular
    .module('uses')
    .factory('UsesService', UsesService);

  UsesService.$inject = ['$resource'];

  function UsesService($resource) {
    return $resource('api/uses/:useId', {
      useId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

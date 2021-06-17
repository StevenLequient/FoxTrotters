// Ditus service used to communicate Ditus REST endpoints
(function () {
  'use strict';

  angular
    .module('ditus')
    .factory('DitusService', DitusService);

  DitusService.$inject = ['$resource'];

  function DitusService($resource) {
    return $resource('api/ditus/:dituId', {
      dituId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

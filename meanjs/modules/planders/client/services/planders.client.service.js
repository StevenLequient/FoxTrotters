(function () {
  'use strict';

  angular
    .module('planders')
    .factory('PlandersService', PlandersService);

  PlandersService.$inject = ['$resource', '$log'];

  function PlandersService($resource, $log) {
    var Plander = $resource('/api/planders/:planderId', {
      planderId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Plander.prototype, {
      createOrUpdate: function () {
        var plander = this;
        return createOrUpdate(plander);
      }
    });

    return Plander;

    function createOrUpdate(plander) {
      console.log('CoU');
      console.dir(plander);
      if (plander._id) {
        return plander.$update(onSuccess, onError);
      } else {
        return plander.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(plander) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());

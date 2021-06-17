(function () {
  'use strict';

  angular
    .module('panoramas')
    .factory('PanoramasService', PanoramasService);

  PanoramasService.$inject = ['$resource', '$log'];

  function PanoramasService($resource, $log) {
    var Panorama = $resource('/api/panoramas/:panoramaId', {
      panoramaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Panorama.prototype, {
      createOrUpdate: function () {
        var panorama = this;
        return createOrUpdate(panorama);
      }
    });

    return Panorama;

    function createOrUpdate(panorama) {
      if (panorama._id) {
        return panorama.$update(onSuccess, onError);
      } else {
        return panorama.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(panorama) {
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

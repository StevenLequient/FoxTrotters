(function () {
  'use strict';

  // Pois controller
  angular
    .module('pois')
    .controller('PoisController', PoisController);

  PoisController.$inject = ['$scope', '$state', '$window', 'Authentication', 'poiResolve'];

  function PoisController ($scope, $state, $window, Authentication, poi) {
    var vm = this;

    vm.authentication = Authentication;
    vm.poi = poi;

    // Avoid a blank possible value in the type selection
    if (!vm.poi.typep) {
      vm.poi.typep = 'plant';
    }

    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Poi
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.poi.$remove($state.go('pois.list'));
      }
    }

    // Save Poi
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.poiForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.poi._id) {
        vm.poi.$update(successCallback, errorCallback);
      } else {
        vm.poi.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('pois.view', {
          poiId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }


    // --- Custom functions ---

    vm.poi.coords = {};
    vm.addMarker = function(event) {
      var ll = event.latLng;
      vm.poi.coords = { 'longitude':ll.lng(), 'latitude': ll.lat()};
    };
  }
}());

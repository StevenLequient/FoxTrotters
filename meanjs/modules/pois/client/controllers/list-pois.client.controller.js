(function () {
  'use strict';

  angular
    .module('pois')
    .controller('PoisListController', PoisListController);

  PoisListController.$inject = ['PoisService', '$scope'];

  function PoisListController(PoisService, $scope) {
    var vm = this;

    vm.pois = PoisService.query();
    $scope.foxMarkers = PoisService.query();
    $scope.category = "";
    $scope.changeFilter = function(criteria){
      $scope.category = criteria;
    };
    $scope.showDetail = function(e, poi) {
      $scope.poi = poi;
      $scope.map.showInfoWindow('foo-iw', poi._id);
    };

    $scope.hideDetail = function() {
      $scope.map.hideInfoWindow('foo-iw');
    };

    var coord = [];
    coord.lat = 43.6156;
    coord.lng = 7.0719;
    return coord;

  }
}());

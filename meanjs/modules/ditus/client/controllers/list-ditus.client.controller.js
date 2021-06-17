(function () {
  'use strict';


  angular
    .module('ditus')
    .controller('DitusListController', DitusListController);

  DitusListController.$inject = ['$scope', 'NgMap'];

  function DitusListController($scope, NgMap) {
    var vm = this;
    $scope.name = 'ok';
    vm.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

    NgMap.getMap().then(function (map) {
      console.log(map.getCenter());
      console.log('markers', map.markers);
      console.log('shapes', map.shapes);

    });
    vm.ditus = [];
  }
}());

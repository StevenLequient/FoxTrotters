(function () {
  'use strict';

  angular
    .module('plants')
    .controller('PlantsListController', PlantsListController);

  PlantsListController.$inject = ['PlantsService', '$scope', '$http'];

  function PlantsListController(PlantsService, $scope, $http) {
    var vm = this;

    vm.plants = PlantsService.query();
    console.dir(vm.plants);
    var DB_PATH = '';

    // pour le convertisseur
    function goUp(plants) {
      for (var pI = 0; pI < plants.length; pI++) {
        $http.post(DB_PATH + '/api/plants', plants[pI]).then(function (ok) {
          console.log(ok);
        }, function (err) {
          console.error(err);
        });
      }
    }


    $scope.file_changed = function (element) {

      $scope.$apply(function (scope) {
        var photofile = element.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
          console.dir(event);
          console.dir(event.target.result);
          var plants = JSON.parse(event.target.result).species;

          var plantsConv = [];

          for (var i = 0; i < plants.length; i++) {
            var plant = plants[i];
            if (plants[i].first_common === null) {
              plants[i].first_common = plants[i].name;
            }
            var newPlant = {
              'commonName': plant.first_common,
              'latinName': plant.name,
              'family': plant.family,
              'genre': plant.genus,
              'uses': [],
              'pois': [],
              'image': [plant.image]
            };
            plantsConv.push(newPlant);
          }
          goUp(plantsConv);
        };
        reader.readAsText(photofile);
      });
    };


  }
}());

(function () {
  'use strict';

  // Plants controller
  angular
    .module('plants')
    .controller('PlantsController', PlantsController);

  PlantsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'plantResolve', '$http'];

  function PlantsController($scope, $state, $window, Authentication, plant, $http) {
    var vm = this;
    console.log('test');
    vm.authentication = Authentication;
    vm.plant = plant;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Plant
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.plant.$remove($state.go('plants.list'));
      }
    }

    // Save Plant
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.plantForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.plant._id) {
        vm.plant.$update(successCallback, errorCallback);
      } else {
        vm.plant.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('plants.view', {
          plantId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // Gets the themes
    $http.get('/api/themes').then(function (res) {
      console.dir(res);
      vm.themes = res.body;
    }, function (err) {
      console.error(err);
    });


    // Dynamic plant use form
    $scope.addNewUse = function () {
      if (!vm.plant.uses) {
        vm.plant.uses = [];
      }
      vm.plant.uses.push({ 'theme': { 'name': 'edible' }, 'desc': '' });
    };

    $scope.removeUse = function () {
      var lastItem = vm.plant.uses.length - 1;
      vm.plant.uses.splice(lastItem);
    };
  }
}());

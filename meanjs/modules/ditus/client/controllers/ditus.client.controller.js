(function () {
  'use strict';


  // Ditus controller
  angular
    .module('ditus')
    .controller('DitusController', DitusController);

  DitusController.$inject = ['$scope', '$state', '$window', 'Authentication', 'dituResolve'];

  function DitusController($scope, $state, $window, Authentication, ditu) {
    var vm = this;

    vm.authentication = Authentication;
    vm.ditu = ditu;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;


    // Remove existing Ditu
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.ditu.$remove($state.go('ditus.list'));
      }
    }

    // Save Ditu
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.dituForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.ditu._id) {
        vm.ditu.$update(successCallback, errorCallback);
      } else {
        vm.ditu.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('ditus.view', {
          dituId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }

    }
  }
}());

(function () {
  'use strict';

  // Uses controller
  angular
    .module('uses')
    .controller('UsesController', UsesController);

  UsesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'useResolve'];

  function UsesController ($scope, $state, $window, Authentication, use) {
    var vm = this;

    vm.authentication = Authentication;
    vm.use = use;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Use
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.use.$remove($state.go('uses.list'));
      }
    }

    // Save Use
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.useForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.use._id) {
        vm.use.$update(successCallback, errorCallback);
      } else {
        vm.use.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('uses.view', {
          useId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

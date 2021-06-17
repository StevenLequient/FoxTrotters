(function () {
  'use strict';

  // Themes controller
  angular
    .module('themes')
    .controller('ThemesController', ThemesController);

  ThemesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'themeResolve'];

  function ThemesController ($scope, $state, $window, Authentication, theme) {
    var vm = this;

    vm.authentication = Authentication;
    vm.theme = theme;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Theme
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.theme.$remove($state.go('themes.list'));
      }
    }

    // Save Theme
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.themeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.theme._id) {
        vm.theme.$update(successCallback, errorCallback);
      } else {
        vm.theme.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('themes.view', {
          themeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

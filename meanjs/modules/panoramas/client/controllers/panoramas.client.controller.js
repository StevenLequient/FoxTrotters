(function () {
  'use strict';

  // Panoramas controller
  angular
    .module('panoramas')
    .controller('PanoramasController', PanoramasController);

  PanoramasController.$inject = ['$scope', '$state', '$window', 'panoramaResolve', 'Authentication', 'Notification', 'Upload', '$timeout', 'PlantsService', '$http'];

  function PanoramasController($scope, $state, $window, panorama, Authentication, Notification, Upload, $timeout, PlantsService, $http) {
    var vm = this;

    vm.authentication = Authentication;
    vm.panorama = panorama;
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.showDemande = true;
    vm.plants=undefined;
    vm.selectedPlant = undefined;


    // Save Panorama
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.panoramaForm');
        return false;
      }
      vm.panorama.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);
    }

    function successCallback(res) {
      $state.go('panoramas.view', {
        panoramaId: res._id
      });
      Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Panorama saved successfully!'});
    }

    function errorCallback(res) {
      vm.error = res.data.message;
    }

    vm.user = Authentication.user;
    vm.progress = 0;

  }

}());

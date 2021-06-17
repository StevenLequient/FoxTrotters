(function () {
  'use strict';

  // Planders controller
  angular
    .module('planders')
    .controller('PlandersController', PlandersController);

  PlandersController.$inject = ['$scope', '$state', '$window', 'planderResolve', 'Authentication', 'Notification', 'Upload', '$timeout', 'PlantsService', '$http'];

  function PlandersController($scope, $state, $window, plander, Authentication, Notification, Upload, $timeout, PlantsService, $http) {
    var vm = this;

    vm.authentication = Authentication;
    vm.plander = plander;

    console.log('plander');
    console.dir(plander);

    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.showDemande = true;
    vm.plants = undefined;
    vm.selectedPlant = undefined;
    vm.setPlantId = setPlantId;
    vm.recoAuto = undefined;

    function autoReco() {
      $http.get('/api/planders/result/' + vm.plander._id).then(function (res) {
        console.dir(res.data);
        vm.showA = true;
        vm.recoAuto = JSON.parse(res.data);
      }, function (err) {
        console.log(err);
      });

    }

    vm.autoReco = autoReco;

    function setPlantId() {
      console.dir(vm.selectedPlant);
      if (vm.selectedPlant._id) {
        vm.plander.plant = vm.selectedPlant._id;
        console.log('setPlantId');
      }
      vm.plander.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);
    }

    $scope.ngModelOptionsSelected = function(value) {
      console.log('Selected');
      console.log(value);

      if (arguments.length) {
        vm.selectedPlant = value;
      } else {
        return vm.selectedPlant;
      }
    };

    $scope.modelOptions = {
      debounce: {
        default: 500,
        blur: 250
      },
      getterSetter: true
    };

    function listPlant() {
      vm.showDemande = false;
      vm.plants = PlantsService.query();

      console.log(vm.plants.size);
    }

    vm.listPlant = listPlant;

    function askCommunity() {
      vm.showDemande = false;
      plander.askCommunity = true;
    }
    // Remove existing Plander
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.plander.$remove($state.go('planders.list'));
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Planders deleted successfully!'});
      }
    }

    // Save Plander
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.planderForm');
        return false;
      }

      vm.plander.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);


    }

    function successCallback(res) {
      $state.go('planders.view', {
        planderId: res._id
      });
      Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Plander saved successfully!'});

    }

    function errorCallback(res) {
      vm.error = res.data.message;
    }

    vm.user = Authentication.user;
    vm.progress = 0;

    vm.upload = function (dataUrl) {
      console.log('upload ...');
      console.dir(dataUrl);
      console.dir(vm.plander);
      Upload.upload({
        url: '/api/planders',
        data: {
          newProfilePicture: dataUrl
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response.data);
        });
      }, function (response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      // Show success message
      Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Successfully changed plander picture'});

      // Populate user object
      // vm.user = Authentication.user = response;

      // Reset form
      vm.fileSelected = false;
      vm.progress = 0;

      $state.go('planders.edit', {
        planderId: response._id
      });
    }

    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      vm.fileSelected = false;
      vm.progress = 0;

      // Show error message
      Notification.error({
        message: response.message,
        title: '<i class="glyphicon glyphicon-remove"></i> Failed to change plander picture'
      });
    }
  }

}());

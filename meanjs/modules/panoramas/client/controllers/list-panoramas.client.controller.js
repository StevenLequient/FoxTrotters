(function () {
  'use strict';

  angular
    .module('panoramas')
    .controller('PanoramasListController', PanoramasListController);

  PanoramasListController.$inject = ['PanoramasService'];

  function PanoramasListController(PanoramasService) {
    var vm = this;

    vm.panoramas = PanoramasService.query();
  }
}());

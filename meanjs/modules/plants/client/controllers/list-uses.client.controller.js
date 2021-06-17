(function () {
  'use strict';

  angular
    .module('uses')
    .controller('UsesListController', UsesListController);

  UsesListController.$inject = ['UsesService'];

  function UsesListController(UsesService) {
    var vm = this;

    vm.uses = UsesService.query();
  }
}());

(function () {
  'use strict';

  angular
    .module('planders')
    .controller('PlandersListController', PlandersListController);

  PlandersListController.$inject = ['PlandersService'];

  function PlandersListController(PlandersService) {
    var vm = this;

    vm.planders = PlandersService.query();
  }
}());

(function () {
  'use strict';

  angular
    .module('themes')
    .controller('ThemesListController', ThemesListController);

  ThemesListController.$inject = ['ThemesService'];

  function ThemesListController(ThemesService) {
    var vm = this;

    vm.themes = ThemesService.query();
  }
}());

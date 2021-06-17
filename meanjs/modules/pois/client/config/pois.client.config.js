(function () {
  'use strict';

  angular
    .module('pois')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Pois',
      state: 'pois',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'pois', {
      title: 'List Pois',
      state: 'pois.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'pois', {
      title: 'Create Poi',
      state: 'pois.create',
      roles: ['user']
    });
  }
}());

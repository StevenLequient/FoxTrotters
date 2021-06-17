(function () {
  'use strict';

  angular
    .module('panoramas')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Panoramas',
      state: 'panoramas',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'panoramas', {
      title: 'List Panoramas',
      state: 'panoramas.list',
      roles: ['*']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'panoramas', {
      title: 'Create Panorama',
      state: 'panoramas.create',
      roles: ['*']
    });
  }
}());

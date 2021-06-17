(function () {
  'use strict';

  angular
    .module('planders')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Reconnaissance',
      state: 'planders',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'planders', {
      title: 'List Planders',
      state: 'planders.list',
      roles: ['*']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'planders', {
      title: 'Create Plander',
      state: 'planders.create',
      roles: ['*']
    });
  }
}());

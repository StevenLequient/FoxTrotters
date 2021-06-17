(function () {
  'use strict';

  angular
    .module('plants')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Plants',
      state: 'plants',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'plants', {
      title: 'List Plants',
      state: 'plants.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'plants', {
      title: 'Create Plant',
      state: 'plants.create',
      roles: ['user']
    });
  }
}());

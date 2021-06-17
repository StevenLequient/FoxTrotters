(function () {
  'use strict';

  angular
    .module('ditus')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Walks',
      state: 'ditus',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'ditus', {
      title: 'List Walks',
      state: 'ditus.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'ditus', {
      title: 'Crear Walks',
      state: 'ditus.create',
      roles: ['user']
    });
  }
}());

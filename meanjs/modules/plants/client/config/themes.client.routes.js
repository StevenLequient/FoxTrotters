(function () {
  'use strict';

  angular
    .module('themes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('themes', {
        abstract: true,
        url: '/themes',
        template: '<ui-view/>'
      })
      .state('themes.list', {
        url: '',
        templateUrl: 'modules/themes/client/views/list-themes.client.view.html',
        controller: 'ThemesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Themes List'
        }
      })
      .state('themes.create', {
        url: '/create',
        templateUrl: 'modules/themes/client/views/form-theme.client.view.html',
        controller: 'ThemesController',
        controllerAs: 'vm',
        resolve: {
          themeResolve: newTheme
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Themes Create'
        }
      })
      .state('themes.edit', {
        url: '/:themeId/edit',
        templateUrl: 'modules/themes/client/views/form-theme.client.view.html',
        controller: 'ThemesController',
        controllerAs: 'vm',
        resolve: {
          themeResolve: getTheme
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Theme {{ themeResolve.name }}'
        }
      })
      .state('themes.view', {
        url: '/:themeId',
        templateUrl: 'modules/themes/client/views/view-theme.client.view.html',
        controller: 'ThemesController',
        controllerAs: 'vm',
        resolve: {
          themeResolve: getTheme
        },
        data: {
          pageTitle: 'Theme {{ themeResolve.name }}'
        }
      });
  }

  getTheme.$inject = ['$stateParams', 'ThemesService'];

  function getTheme($stateParams, ThemesService) {
    return ThemesService.get({
      themeId: $stateParams.themeId
    }).$promise;
  }

  newTheme.$inject = ['ThemesService'];

  function newTheme(ThemesService) {
    return new ThemesService();
  }
}());

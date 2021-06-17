(function () {
  'use strict';

  angular
    .module('planders')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('planders', {
        abstract: true,
        url: '/planders',
        template: '<ui-view/>'
      })
      .state('planders.list', {
        url: '',
        templateUrl: 'modules/planders/client/views/list-planders.client.view.html',
        controller: 'PlandersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Planders List',
          roles: ['user', 'admin']
        }
      })
      .state('planders.create', {
        url: '/create',
        templateUrl: 'modules/planders/client/views/form-plander.client.view.html',
        controller: 'PlandersController',
        controllerAs: 'vm',
        resolve: {
          planderResolve: newPlander
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Planders Create'
        }
      })
      .state('planders.edit', {
        url: '/:planderId/edit',
        templateUrl: '/modules/planders/client/views/form-plander.client.view.html',
        controller: 'PlandersController',
        controllerAs: 'vm',
        resolve: {
          planderResolve: getPlander
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Plander {{ planderResolve.name }}'
        }
      })
      .state('planders.view', {
        url: '/:planderId',
        templateUrl: '/modules/planders/client/views/view-plander.client.view.html',
        controller: 'PlandersController',
        controllerAs: 'vm',
        resolve: {
          planderResolve: getPlander
        },
        data: {
          pageTitle: 'Plander {{ planderResolve.name }}',
          roles: ['user', 'admin']
        }
      });
  }

  getPlander.$inject = ['PlandersService', '$stateParams'];

  function getPlander(PlandersService, $stateParams) {
    return PlandersService.get({
      planderId: $stateParams.planderId
    }).$promise;
  }

  newPlander.$inject = ['PlandersService'];

  function newPlander(PlandersService) {
    return new PlandersService();
  }
}());

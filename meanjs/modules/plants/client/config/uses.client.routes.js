(function () {
  'use strict';

  angular
    .module('uses')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('uses', {
        abstract: true,
        url: '/uses',
        template: '<ui-view/>'
      })
      .state('uses.list', {
        url: '',
        templateUrl: 'modules/uses/client/views/list-uses.client.view.html',
        controller: 'UsesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Uses List'
        }
      })
      .state('uses.create', {
        url: '/create',
        templateUrl: 'modules/uses/client/views/form-use.client.view.html',
        controller: 'UsesController',
        controllerAs: 'vm',
        resolve: {
          useResolve: newUse
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Uses Create'
        }
      })
      .state('uses.edit', {
        url: '/:useId/edit',
        templateUrl: 'modules/uses/client/views/form-use.client.view.html',
        controller: 'UsesController',
        controllerAs: 'vm',
        resolve: {
          useResolve: getUse
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Use {{ useResolve.name }}'
        }
      })
      .state('uses.view', {
        url: '/:useId',
        templateUrl: 'modules/uses/client/views/view-use.client.view.html',
        controller: 'UsesController',
        controllerAs: 'vm',
        resolve: {
          useResolve: getUse
        },
        data: {
          pageTitle: 'Use {{ useResolve.name }}'
        }
      });
  }

  getUse.$inject = ['$stateParams', 'UsesService'];

  function getUse($stateParams, UsesService) {
    return UsesService.get({
      useId: $stateParams.useId
    }).$promise;
  }

  newUse.$inject = ['UsesService'];

  function newUse(UsesService) {
    return new UsesService();
  }
}());

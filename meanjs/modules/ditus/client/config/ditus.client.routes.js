(function () {
  'use strict';

  angular
    .module('ditus')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('ditus', {
        abstract: true,
        url: '/ditus',
        template: '<ui-view/>'
      })
      .state('ditus.list', {
        url: '',
        templateUrl: 'modules/ditus/client/views/list-ditus.client.view.html',
        controller: 'DitusListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Ditus List'
        }
      })
      .state('ditus.create', {
        url: '/create',
        templateUrl: 'modules/ditus/client/views/form-ditu.client.view.html',
        controller: 'DitusController',
        controllerAs: 'vm',
        resolve: {
          dituResolve: newDitu
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Ditus Create'
        }
      })
      .state('ditus.edit', {
        url: '/:dituId/edit',
        templateUrl: 'modules/ditus/client/views/form-ditu.client.view.html',
        controller: 'DitusController',
        controllerAs: 'vm',
        resolve: {
          dituResolve: getDitu
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Ditu {{ dituResolve.name }}'
        }
      })
      .state('ditus.view', {
        url: '/:dituId',
        templateUrl: 'modules/ditus/client/views/view-ditu.client.view.html',
        controller: 'DitusController',
        controllerAs: 'vm',
        resolve: {
          dituResolve: getDitu
        },
        data: {
          pageTitle: 'Ditu {{ dituResolve.name }}'
        }
      });
  }

  getDitu.$inject = ['$stateParams', 'DitusService'];

  function getDitu($stateParams, DitusService) {
    return DitusService.get({
      dituId: $stateParams.dituId
    }).$promise;
  }

  newDitu.$inject = ['DitusService'];

  function newDitu(DitusService) {
    return new DitusService();
  }
}());

(function () {
  'use strict';

  angular
    .module('pois')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('pois', {
        abstract: true,
        url: '/pois',
        template: '<ui-view/>'
      })
      .state('pois.list', {
        url: '',
        templateUrl: 'modules/pois/client/views/list-pois.client.view.html',
        controller: 'PoisListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Pois List'
        }
      })
      .state('pois.create', {
        url: '/create',
        templateUrl: 'modules/pois/client/views/form-poi.client.view.html',
        controller: 'PoisController',
        controllerAs: 'vm',
        resolve: {
          poiResolve: newPoi
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Pois Create'
        }
      })
      .state('pois.edit', {
        url: '/:poiId/edit',
        templateUrl: 'modules/pois/client/views/form-poi.client.view.html',
        controller: 'PoisController',
        controllerAs: 'vm',
        resolve: {
          poiResolve: getPoi
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Poi {{ poiResolve.name }}'
        }
      })
      .state('pois.view', {
        url: '/:poiId',
        templateUrl: 'modules/pois/client/views/view-poi.client.view.html',
        controller: 'PoisController',
        controllerAs: 'vm',
        resolve: {
          poiResolve: getPoi
        },
        data: {
          pageTitle: 'Poi {{ poiResolve.name }}'
        }
      });
  }

  getPoi.$inject = ['$stateParams', 'PoisService'];

  function getPoi($stateParams, PoisService) {
    return PoisService.get({
      poiId: $stateParams.poiId
    }).$promise;
  }

  newPoi.$inject = ['PoisService'];

  function newPoi(PoisService) {
    return new PoisService();
  }
}());

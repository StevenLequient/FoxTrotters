(function () {
  'use strict';

  angular
    .module('panoramas')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('panoramas', {
        abstract: true,
        url: '/panoramas',
        template: '<ui-view/>'
      })
      .state('panoramas.list', {
        url: '',
        templateUrl: 'modules/panoramas/client/views/list-panoramas.client.view.html',
        controller: 'PanoramasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Panoramas List',
          roles: ['user', 'admin']
        }
      })
      .state('panoramas.create', {
        url: '/create',
        templateUrl: 'modules/panoramas/client/views/form-panorama.client.view.html',
        controller: 'PanoramasController',
        controllerAs: 'vm',
        resolve: {
          panoramaResolve: newPanorama
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Panoramas Create'
        }
      })
      .state('panoramas.edit', {
        url: '/:panoramaId/edit',
        templateUrl: '/modules/panoramas/client/views/form-panorama.client.view.html',
        controller: 'PanoramasController',
        controllerAs: 'vm',
        resolve: {
          panoramaResolve: getPanorama
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Panorama {{ panoramaResolve.name }}'
        }
      })
      .state('panoramas.view', {
        url: '/:panoramaId',
        templateUrl: '/modules/panoramas/client/views/view-panorama.client.view.html',
        controller: 'PanoramasController',
        controllerAs: 'vm',
        resolve: {
          panoramaResolve: getPanorama
        },
        data: {
          pageTitle: 'Panorama {{ panoramaResolve.name }}',
          roles: ['user', 'admin']
        }
      });
  }

  getPanorama.$inject = ['PanoramasService', '$stateParams'];

  function getPanorama(PanoramasService, $stateParams) {
    return PanoramasService.get({
      panoramaId: $stateParams.panoramaId
    }).$promise;
  }

  newPanorama.$inject = ['PanoramasService'];

  function newPanorama(PanoramasService) {
    return new PanoramasService();
  }
}());

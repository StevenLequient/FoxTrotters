(function () {
  'use strict';

  angular
    .module('plants')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('plants', {
        abstract: true,
        url: '/plants',
        template: '<ui-view/>'
      })
      .state('plants.list', {
        url: '',
        templateUrl: 'modules/plants/client/views/list-plants.client.view.html',
        controller: 'PlantsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Plants List'
        }
      })
      .state('plants.create', {
        url: '/create',
        templateUrl: 'modules/plants/client/views/form-plant.client.view.html',
        controller: 'PlantsController',
        controllerAs: 'vm',
        resolve: {
          plantResolve: newPlant
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Plants Create'
        }
      })
      .state('plants.edit', {
        url: '/:plantId/edit',
        templateUrl: 'modules/plants/client/views/form-plant.client.view.html',
        controller: 'PlantsController',
        controllerAs: 'vm',
        resolve: {
          plantResolve: getPlant
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Plant {{ plantResolve.name }}'
        }
      })
      .state('plants.view', {
        url: '/:plantId',
        templateUrl: 'modules/plants/client/views/view-plant.client.view.html',
        controller: 'PlantsController',
        controllerAs: 'vm',
        resolve: {
          plantResolve: getPlant
        },
        data: {
          pageTitle: 'Plant {{ plantResolve.name }}'
        }
      });
  }

  getPlant.$inject = ['$stateParams', 'PlantsService'];

  function getPlant($stateParams, PlantsService) {
    return PlantsService.get({
      plantId: $stateParams.plantId
    }).$promise;
  }

  newPlant.$inject = ['PlantsService'];

  function newPlant(PlantsService) {
    return new PlantsService();
  }
}());

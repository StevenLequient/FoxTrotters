/**
 * Created by user on 01/06/17.
 */
angular.module('foxapp')
  .config(function($stateProvider, $urlRouterProvider){

    $stateProvider
      .state('map', {
        url: '/',
        templateUrl: 'view/map.html',
        controller: 'GMapController'
      });

    $urlRouterProvider.otherwise("/");

  });


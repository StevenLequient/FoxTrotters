// Ionic Starter App


// Config
var dbPath = "http://ns388671.ip-176-31-254.eu/";
//var dbPath = "http://localhost/";

// Distance de déclenchement de notification en km
var notifDistance = 0.15;

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('foxapp', ['ionic', 'ui.bootstrap.modal','ngMap', 'ngFileUpload','ngCordova', 'ngTouch', 'ngSwippy'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});


/*
.config(function($routeProvider){
  $routeProvider

  .when("/",{
    templateUrl : 'page/map.html',
    controller : 'MapController'
  });

})*/

// Themes service used to communicate Themes REST endpoints
(function () {
  'use strict';

  angular
    .module('themes')
    .factory('ThemesService', ThemesService);

  ThemesService.$inject = ['$resource'];

  function ThemesService($resource) {
    return $resource('api/themes/:themeId', {
      themeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

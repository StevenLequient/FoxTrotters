/**
 * Created by user on 06/06/17.
 */
angular.module('foxapp')

.factory("RESTService", ["$http",
  function($http){
  return{
    get : function(URL){
      return $http.get(URL).then(function (result) {
        return result.data;
      });
    },
    post : function(URL, data){
      var req = {
        method: 'POST',
        url: URL,
        data:data
      };
      return $http(req).then(function(result) {

        return result.data;
      })
    },
    put : function(URL, data){
      var req = {
        method: 'PUT',
        url: URL,
        data:data
      };
      return $http(req).then(function(result){
        return result.data;
      })
    }
  }
}]);

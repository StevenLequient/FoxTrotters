/**
 * Created by user on 08/06/17.
 */
angular.module('foxapp')

.factory('GeolocationService',['$cordovaGeolocation',

  function($cordovaGeolocation){


  return {

    getCurrentPosition : function(posOptions) {
      var posOptions = {timeout: 30000};

      return $cordovaGeolocation.getCurrentPosition(posOptions).
      then(function (position) {
        var coord = [];
        coord.lat = position.coords.latitude;
        coord.lng = position.coords.longitude;
        return coord;
      }, function (err) {
        var coord = [];
        coord.lat = 43.6156;
        coord.lng = 7.0719;
        return coord;
      });
    },

    getDistanceFromLatLonInKm : function(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
      var dLon = this.deg2rad(lon2-lon1);
      var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      return d;
    },

    deg2rad : function(deg) {
      return deg * (Math.PI/180);
    }

  }

  }]);

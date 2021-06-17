
angular.module('foxapp')

  .factory('$cordovaGear', [

    function () {

    return {
      isSupported : function () {

        var success = function (param) {
          console.log("is supported : " + param);
          return true;
        };

        var fail = function (param) {
          console.log("fail supported : " + param);
          return false;
        };

        samsung.richnotification.isSupported(
          success,
          fail
        );
      },


      isConnected : function () {
        var success = function (param) {
          console.log("is connected " + param);
          return true;
        };

        var fail = function (param) {
          console.log("fail connected " + param);
          return false;
        };

        samsung.richnotification.isConnected(
          success,
          fail
        );
      },

      registerEventListeners : function () {
        var success = function (param) {
          console.log("success event " + param);
          return true;
        };

        var fail = function (param) {
          console.log("fail register "+ param);
          return false;
        }

        samsung.richnotification.registerEventListeners(
          success,
          fail
        );
      },


      send : function (options) {
        var success = function (param) {
          console.log("success param : " + param);
          return true;
        };

        var fail = function (param) {
          console.log("fail param : " + param);
          return false;
        };

        samsung.richnotification.send(
          options,
          success,
          fail
        );
      },


      dismiss : function (uuid) {
        var success = function () {
          return true;
        };

        var fail = function () {
          return false;
        }

        samsung.richnotification.isSupported(
          uuid,
          success,
          fail
        );
      }
    }
  }]);

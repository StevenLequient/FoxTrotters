/**
 * Created by user on 01/06/17.
 */
angular.module('foxapp')
  .factory('MarkerService', ['RESTService',

    function (RESTService) {

      var offlinePOI = [
        {
          "coords" : {
            "lat" : 40.730610,
            "lng" : -73.935242
          },
          "imagePath" : "shaprr"
        },
        {
          "coords" : {
            "lat" : 35.652832,
            "lng" : 139.839478
          },
          "imagePath" : "shaprr"
        },
        {
          "coords" : {
            "lat" : 1.3278,
            "lng" : 172.97696
          },
          "imagePath" : "shaprr"
        }
      ];

      return {

        getAllMarkers : function() {
          return RESTService.get(dbPath+"api/pois");
        },

        pushPosition : function(coords, imagePath){
          var poi = {
            "coords":coords,
            "imagePath": imagePath
          };

          offlinePOI.push(poi);
          console.log(offlinePOI);
        },

        getOfflineList : function(){
          return offlinePOI;
        },

        resetOfflineList : function () {
          offlinePOI = [];
        }

      };
    }
  ]);

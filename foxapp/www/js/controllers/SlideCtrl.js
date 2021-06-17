angular.module('foxapp')

  .controller('SlideCtrl', ['$scope','$ionicSlideBoxDelegate',

    function($scope, $ionicSlideBoxDelegate) {

      $scope.dbPath = dbPath;

      $scope.logSlideChanged = function (index) {

        console.log("we Are "+ index);

        if(index === 0) {

          $ionicSlideBoxDelegate.enableSlide(false);
          console.log('Slider status : false');
        }
        else {
          $ionicSlideBoxDelegate.enableSlide(true);
          console.log('Slider status : true');
        }
      };

    }]);

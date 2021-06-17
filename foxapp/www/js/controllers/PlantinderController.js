angular.module('foxapp')

  .controller('PlantinderController', ['$scope','$swipe','$ionicPopup','$ionicSlideBoxDelegate',

    function($scope, $swipe, $ionicPopup, $ionicSlideBoxDelegate){
    $scope.isOver = false;

    $scope.size = {
      width : 200,
      height : 100
    };

      $scope.itemsCollection = [{
        thumbnail: 'pictures/01.jpeg',
        title: '',
        subtitle: ''
      }, {
        thumbnail: 'pictures/02.jpeg',
        title: '',
        subtitle: ''
      },
        {
        thumbnail: 'pictures/03.jpg',
        title: '',
        subtitle: ''
      }, {
        thumbnail: 'pictures/04.jpg',
        title: '',
        subtitle: ''
      }],
        $scope.zoomPicture = function(){
      };
      $scope.showinfo = function(){
      };


      $scope.swipeLeft = function(){

      };


      $scope.swipeRight = function(){

        var myPopup = $ionicPopup.show({
          template: '<input type="text">',
          title: 'Entrez le nom de la plante',
          subTitle: '',
          scope: $scope,
          buttons: [
            { text: 'Annuler' },
            {
              text: '<b>Identifier</b>'
            }
          ]
        });
      };

      $scope.swipeend = function(){
        $scope.isOver = true;
        $ionicSlideBoxDelegate.enableSlide(true);
        $ionicSlideBoxDelegate.select(true);
      };


      $scope.disableSwipe = function(){
        if(!$scope.isOver){
          $ionicSlideBoxDelegate.enableSlide(false);
        }
      };
      $scope.enableSwipe = function(){
        if(!$scope.isOver) {
          $ionicSlideBoxDelegate.enableSlide(true);
        }
      };
    }]);

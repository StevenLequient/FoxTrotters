angular.module('foxapp')

  .controller('PhotoController', ['$scope', 'PictureUploadService', 'GeolocationService', 'MarkerService','PhotoService',

    function ($scope, PictureUploadService, $cordovaCamera, GeolocationService, MarkerService, PhotoService) {


      $scope.sendPicture = function (URL, image) {
        return image.then(function (imageData) {
            return PictureUploadService.upload(imageData, URL);
          }
        );
      };

      $scope.readyCamera = function(){
        PhotoService.readyCamera();
      };

      $scope.takePicture = function(){
        return PhotoService.takePicture(PhotoService.cameraDefaultOps);
      };

      $scope.close = function () {
        $scope.uploadHide = true;
      };

      $scope.savePOI = function(imagePromise){
        return imagePromise.then(function (imageData) {
            var imagePath = imageData;
            GeolocationService.getCurrentPosition({}).then(
              function(coords){
                MarkerService.pushPosition(coords, imagePath);
              }
            );
          }
        );
      };

    }]);

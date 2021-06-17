/**
 * Created by user on 08/06/17.
 */
angular.module('foxapp')
.factory('PictureUploadService', ['$cordovaFileTransfer',

  function($cordovaFileTransfer){

      return{
      upload : function (file, URL) {


        var options = {
          fileKey: "newProfilePicture",
          fileName: file.substr(file.lastIndexOf('/') + 1),
          chunkedMode: false,
          mimeType: "image/jpeg"
        };

        return $cordovaFileTransfer.upload(URL, file, options).then(function (result) {
          console.log("SUCCESS: " + JSON.stringify(result.response));
          return result.response;
        }, function (err) {
          console.log("ERROR: " + JSON.stringify(err));
        }, function (progress) {
          // PROGRESS HANDLING GOES HERE
        });



/*        Upload.upload({
          url: URL,
          newProfilePicture: file
        }).then(function (resp) {
          console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
          console.log('Error status: ' + resp.status);
        });*/
      }
    }
}]);

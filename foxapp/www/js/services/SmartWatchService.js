/**
 * Created by user on 06/06/17.
 */

/*import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

constructor(private bluetoothSerial: BluetoothSerial) { }*/

angular.module('foxapp')
  .factory('SmartWatchService', ['$cordovaGear',

    //REGARDE EN BAS DU LIEN https://seap.samsung.com/sample-app/cordova-plugins-samsung-demo-app
    //Le wrapper est défini dans RichNotificationWrapper
    //il implémente le js du plugin décrit /home/user/projuin/fox_trotters/private/foxapp/plugins/com.samsung.richnotification/www/richnotification.js
    //C'est le yolo total après, mais au moins ça passe la compilation angular, à prioris ça devrait marcher
    //Samsung Gear > Notifications > Limit notifications



    function ($cordovaGear) {

      var proximityNotification = {
        "uuid": "",
        "readoutTitle": "Vous êtes a proximité d'un point d'intérêt",
        "readout": "Vous êtes a proximité d'un point d'intérêt",
        "notificationTitle": "Vous êtes a proximité d'un point d'intérêt",
        "headerSizeType": undefined,
        "primarySubHeader": "Vous êtes a proximité d'un point d'intérêt",
        "primaryBody": "",
        "primaryQRImage": "",
        "primaryBackgroundColor": "#008000",
        "primaryBackgroundImage": "",
        "secondaryType": undefined,
        "secondarySubHeader": "",
        "secondaryContent": "",
        "secondaryBackgroundColor": "",
        "secondaryImage": "",
        "smallIcon1Path": "",
        "smallIcon1Text": "",
        "smallIcon2Path": "",
        "smallIcon2Text": "",
        "notificationIcon": "",
        "alertType": "104",
        "popupType": "202",
        "actions": null
      };

      var dangerNotification = {
        "uuid": "",
        "readoutTitle": "Attention danger!",
        "readout": "Un ours vous poursuit!",
        "notificationTitle": "Attention danger!",
        "headerSizeType": undefined,
        "primarySubHeader": "Un ours vous poursuit",
        "primaryBody": "",
        "primaryQRImage": "",
        "primaryBackgroundColor": "#800000",
        "primaryBackgroundImage": "",
        "secondaryType": undefined,
        "secondarySubHeader": "",
        "secondaryContent": "",
        "secondaryBackgroundColor": "",
        "secondaryImage": "",
        "smallIcon1Path": "",
        "smallIcon1Text": "",
        "smallIcon2Path": "",
        "smallIcon2Text": "",
        "notificationIcon": "",
        "alertType": "104",
        "popupType": "202",
        "actions": null};

      var viewPointNotification = {
        "uuid": "",
        "readoutTitle": "Point de vue proche!",
        "readout": "Point de vue proche!",
        "notificationTitle": "Point de vue proche!",
        "headerSizeType": undefined,
        "primarySubHeader": "Point de vue proche!",
        "primaryBody": "",
        "primaryQRImage": "",
        "primaryBackgroundColor": "#000080",
        "primaryBackgroundImage": "",
        "secondaryType": undefined,
        "secondarySubHeader": "",
        "secondaryContent": "",
        "secondaryBackgroundColor": "",
        "secondaryImage": "",
        "smallIcon1Path": "",
        "smallIcon1Text": "",
        "smallIcon2Path": "",
        "smallIcon2Text": "",
        "notificationIcon": "",
        "alertType": "104",
        "popupType": "202",
        "actions": null};

      return {
        notificate: function (opts) {
          //var jsonPOI = {name: namePOI, pos: positionPOI};
           console.log('sending notif');

            $cordovaGear.send(opts);


        },
        getDanger: function(){
          return dangerNotification;
        },
        getProximity: function(){
          return proximityNotification;
        },
        getViewPoint: function(){
          return viewPointNotification;
        },
        notify: function(label, distance, opts){
          this.notificate(opts);
        }
      };

    }]);

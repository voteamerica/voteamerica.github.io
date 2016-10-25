// var remoteUrl = "http://localhost:8000";                                                                 
var remoteUrl = "https://api.carpoolvote.com/live";

// call page with querystring
// self.html?UUID_driver=9dba44a5-8188-4ced-925f-11c80fa9e130&DriverPhone=07958110786

// will support fairly old browsers?
// 
// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var UUID_driver = getParameterByName('UUID_driver'); 
var UUID_rider  = getParameterByName('UUID_rider'); 
var Score       = getParameterByName('Score'); 

// these will be put input into the text field rather than passed as querystring params
// var DriverPhone = getParameterByName('DriverPhone'); 
// var RiderPhone = getParameterByName('RiderPhone'); 
// var LastName = getParameterByName('LastName'); 

function getCheckValue () {
  var phoneNumField = document.getElementById("inputPhoneNumber");

  return phoneNumField.value;
}

function hideButton (buttonId) {
  var buttonToHide = document.getElementById(buttonId);

  if (buttonToHide) {
    buttonToHide.classList.add("hiddenButton");
  }
}
 
if (UUID_driver === null) {
  hideButton("btnCancelDriveOffer");
  hideButton("btnCancelDriverMatch");
  hideButton("btnPauseDriverMatch");
}

if (UUID_rider === null) {
  hideButton("btnCancelRideRequest");
  hideButton("btnCancelRiderMatch");
}

if (UUID_driver === null || Score === null) {
  hideButton("btnAcceptDriverMatch");
}

if (UUID_driver === null && UUID_rider === null) {
  updateFnInfo("Please access this page via the email or sms link. If there is an issue, please contact support@carpoolvote.com");
}

function updateFnInfo (info) {
  var infoText = document.getElementById("execFnInfo");

  infoText.innerHTML=info;
}

function executeDbFunction (url) {
  var checkField = getCheckValue();

  updateFnInfo("");

  if (checkField === "") {

    updateFnInfo("Please enter a phone number or last name");

    return;
  }

  url += checkField;


  var request = new XMLHttpRequest();

  request.responseType = 'text';

  request.onload = function () {
      if (request.readyState === request.DONE) {
          if (request.status === 200) {
            var dbInfo = {};
            var info = "";

            try {
              dbInfo = JSON.parse(request.response);

              var keys = Object.keys(dbInfo);

              if (keys) {
                info = dbInfo[keys[0]].toString();
                updateFnInfo(info);
              }
            }
            catch (err) {
              updateFnInfo("");
            }
          }
      }
  };

  request.open("GET", url);
  request.send();
}

function cancelRideRequest() {
  var url = 
    remoteUrl + 
    '/cancel-ride-request?' + 
    'UUID=' + UUID_rider + 
    '&RiderPhone=';

  executeDbFunction(url);
}

function cancelRiderMatch() {
  var url = 
    remoteUrl + '/cancel-rider-match?' + 
    'UUID_driver=' + UUID_driver +
    '&UUID_rider=' + UUID_rider + 
    '&Score=' + Score +
    '&RiderPhone=';

  executeDbFunction(url);
}

function cancelDriveOffer() {
  var url = 
    remoteUrl + '/cancel-drive-offer?' + 
    'UUID=' + UUID_driver +
    '&DriverPhone=';

  executeDbFunction(url);
}

function cancelDriverMatch() {
  var url = 
    remoteUrl + '/cancel-driver-match?' + 
    'UUID_driver=' + UUID_driver +
    '&UUID_rider=' + UUID_rider + 
    '&Score=' + Score +
    '&DriverPhone=';

    executeDbFunction(url);
}

function acceptDriverMatch() {
  var url = 
    remoteUrl + '/accept-driver-match?' + 
    'UUID_driver=' + UUID_driver +
    '&UUID_rider=' + UUID_rider + 
    '&Score=' + Score +
    '&DriverPhone=';

  executeDbFunction(url);
}

function pauseDriverMatch() {
  var url = 
    remoteUrl + '/pause-driver-match?' + 
    'UUID=' + UUID_driver +
    '&DriverPhone=';

  executeDbFunction(url);
}

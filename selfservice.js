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
var UUID_rider = getParameterByName('UUID_rider'); 
var Score = getParameterByName('Score'); 

// these will be put input into the text field rather than passed as querystring params
// var DriverPhone = getParameterByName('DriverPhone'); 
// var RiderPhone = getParameterByName('RiderPhone'); 
// var LastName = getParameterByName('LastName'); 

function getCheckValue() {
  var phoneNumField = document.getElementById("inputPhoneNumber");

  return phoneNumField.value;
}
 
if (UUID_driver === null) {
  var buttonCancelDriveOffer = document.getElementById("btnCancelDriveOffer");

  buttonCancelDriveOffer.className += "hiddenButton";
}

if (UUID_rider === null) {
  var buttonCancelRideRequest = document.getElementById("btnCancelRideRequest");

  buttonCancelRideRequest.className += "hiddenButton";
}

if (Score === null) {
  var buttonAcceptDriverMatch = document.getElementById("btnAcceptDriverMatch");

  buttonAcceptDriverMatch.className += "hiddenButton";
}


function cancelRideRequest() {
  // var checkField = (RiderPhone || LastName || "");
  var checkField = getCheckValue();

  buttonCancelDriveOffer.className += "hiddenButton";

  var url = 
    remoteUrl + 
    '/cancel-ride-request?' + 
    'UUID=' + UUID_rider + 
    '&RiderPhone=' + checkField;

  var request = new XMLHttpRequest();

  request.open("GET", url);
  request.send();
}

function cancelRiderMatchTest() {
  var formData  = new FormData();
  var url = 
    remoteUrl + '/cancel-rider-match?' + 
    'UUID_driver=1e6e274d-ad33-4127-9f02-f35b48a07897' +
    '&UUID_rider=1e6e274d-ad33-4127-9f02-f35b48a07897' +
    '&Score=123' +
    '&RiderPhone=123';
  var request = new XMLHttpRequest();

  // formData.append("UUID", "1e6e274d-ad33-4127-9f02-f35b48a07897");
  // formData.append("RiderPhone", '1');

  // request.open("POST", url);
  request.open("GET", url);
  request.send(formData);
}

function cancelDriveOffer() {
  var checkField = getCheckValue();
  // var checkField = (DriverPhone || LastName || "");

  var url = 
    remoteUrl + '/cancel-drive-offer?' + 
    'UUID=' + UUID_driver +
    '&DriverPhone=' + checkField;

  var request = new XMLHttpRequest();

  request.open("GET", url);
  request.send();
}

function cancelDriverMatchTest() {
  var formData  = new FormData();
  var url = 
    remoteUrl + '/cancel-driver-match?' + 
    'UUID_driver=1e6e274d-ad33-4127-9f02-f35b48a07897' +
    '&UUID_rider=1e6e274d-ad33-4127-9f02-f35b48a07897' +
    '&Score=123' +
    '&DriverPhone=123';
  var request = new XMLHttpRequest();

  // formData.append("UUID", "1e6e274d-ad33-4127-9f02-f35b48a07897");
  // formData.append("DriverPhone", '1');

  // request.open("POST", url);
  request.open("GET", url);
  request.send(formData);
}

function acceptDriverMatch() {
  var checkField = getCheckValue();

  var url = 
    remoteUrl + '/accept-driver-match?' + 
    'UUID_driver=' + UUID_driver +
    '&UUID_rider=' + UUID_rider + 
    '&Score=' + Score +
    '&DriverPhone=' + checkField;

  var request = new XMLHttpRequest();

  request.open("GET", url);
  request.send();
}

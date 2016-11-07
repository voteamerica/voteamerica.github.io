// var remoteUrl = "https://api.carpoolvote.com/live";
var remoteUrl = "http://localhost:8000";

var driverLoggedIn = false;
var riderLoggedIn = false;

// Create a data object containing all URL query string data:
var data = tinyQuery.getAll();

if (data.uuid_driver) {
  data.uuid = data.uuid || data.uuid_driver;
  data.type = data.type || 'driver';
}
if (data.uuid_rider) {
  data.uuid = data.uuid || data.uuid_rider;
  data.type = data.type || 'rider';
}

// Cache jQuery selectors:
var $login = $('#login'),
  $manage = $('#manage'),
  $manageLogin = $('#manageLogin'),
  $info = $manage.find('#info'),
  $infoLogin = $manageLogin.find('#info')
  ;


if (data.uuid) {
  $login.find('#enter-uuid').remove();
}
if (data.type) {
  $login.find('#enter-type').remove();
}


$login.validator().on('submit', function(e) {
  if (e.isDefaultPrevented()) {
    return;
  }
  data.uuid = data.uuid || $(this).find('#inputUUID').val();
  data.type = data.type || $(this).find('#enter-type').find('input:checked').val();
  data.phone = $(this).find('#inputPhoneNumber').val();

  if (data.type === "driver") {
    driverExists();
  }
  else {
    riderExists();
  }

  // done in driver exists
  //
  // $(this).slideUp(300).attr('aria-hidden','true');
  // $manage.slideDown(300).attr('aria-hidden','false');
  // updateUI();
  e.preventDefault();
});


function updateUI(uuid, type, phone) {
  $manage.find('#btnCancelDriveOffer').toggle(data.type === 'driver');
  $manage.find('#btnCancelDriverMatch').toggle(data.type === 'driver' && data.score !== 'undefined');
  $manage.find('#btnPauseDriverMatch').toggle(data.type === 'driver' && data.score !== 'undefined');

  $manage.find('#btnCancelRideRequest').toggle(data.type === 'rider');
  $manage.find('#btnCancelRiderMatch').toggle(data.type === 'rider' && data.score !== 'undefined');

  $manage.find('#btnAcceptDriverMatch').toggle(data.type === 'driver' && data.score !== 'undefined');
}


$manage
  .on('click', '#btnCancelRideRequest', cancelRideRequest)
  .on('click', '#btnCancelRiderMatch', cancelRiderMatch)
  .on('click', '#btnCancelDriveOffer', cancelDriveOffer)
  .on('click', '#btnCancelDriverMatch', cancelDriverMatch)
  .on('click', '#btnPauseDriverMatch', pauseDriverMatch)
  .on('click', '#btnAcceptDriverMatch', acceptDriverMatch)
  .on('click', '#logout', logout);


function cancelRideRequest() {
  if (!window.confirm('This will cancel your ride request. Are you sure you want to proceed?')) {
    return;
  }
  sendAjaxRequest(
    {
      uuid: data.uuid,
      RiderPhone: data.phone
    },
    '/cancel-ride-request'
  );
}

function cancelRiderMatch() {
  if (!window.confirm('This will cancel your ride match. Are you sure you want to proceed?')) {
    return;
  }
  sendAjaxRequest(
    {
      UUID_driver: data.uuid_driver,
      UUID_rider: data.uuid,
      Score: data.score,
      RiderPhone: data.phone
    },
    '/cancel-rider-match'
  );
}

function cancelDriveOffer() {
  if (!window.confirm('This will cancel your ride offer. Are you sure you want to proceed?')) {
    return;
  }
  sendAjaxRequest(
    {
      uuid: data.uuid,
      DriverPhone: data.phone
    },
    '/cancel-drive-offer'
  );
}

function cancelDriverMatch() {
  if (!window.confirm('This will cancel your ride match. Are you sure you want to proceed?')) {
    return;
  }
  sendAjaxRequest(
    {
      UUID_driver: data.uuid_driver,
      UUID_rider: data.uuid,
      Score: data.score,
      RiderPhone: data.phone
    },
    '/cancel-driver-match'
  );
}

function acceptDriverMatch() {
  sendAjaxRequest(
    {
      UUID_driver: data.uuid,
      UUID_rider: data.uuid_rider,
      Score: data.score,
      DriverPhone: data.phone
    },
    '/accept-driver-match'
  );
}

function pauseDriverMatch() {
  sendAjaxRequest(
    {
      uuid: data.uuid,
      DriverPhone: data.phone
    },
    '/pause-driver-match'
  );
}

function logout() {
  window.location.search = tinyQuery.remove(['type','uuid','uuid_driver','uuid_rider']);
}


function sendAjaxRequest(ajaxData, ajaxPath) {
  var url = tinyQuery.set(ajaxData, remoteUrl + ajaxPath);

  $info.html('⏳ Loading&hellip;');

  $.getJSON(url, function(dbInfo) {
    var keys = Object.keys(dbInfo);
    if (keys) {
      info = dbInfo[keys[0]].toString();
      $info.text('ℹ️ ' + info);
    }
  })
  .fail(function(err) {
    $info.text('⚠️ ' + err.statusText);
  });
}

function driverExists () {
//http://localhost:8000/driver-exists?UUID=32e5cbd4-1342-4e1e-9076-0147e779a796&DriverPhone=Test

  var url = 
    remoteUrl + '/driver-exists?' + 
    'UUID=' + data.uuid +
    '&DriverPhone=' + data.phone;

  var request = new XMLHttpRequest();

  request.open("GET", url);
  request.send();

  request.onreadystatechange = function () {
    if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      console.log(request.responseText);

      var resp = JSON.parse(request.responseText);

      var keys = Object.keys(resp);
      if (keys) {
        info = resp[keys[0]].toString();
        // $info.text(info);
        $infoLogin.text(info);

        if (keys[0] == "driver_exists" && info === "") {
          driverLoggedIn = true;

          $(this).slideUp(300).attr('aria-hidden','true');
          $manage.slideDown(300).attr('aria-hidden','false');
          updateUI();

          driverInfo();
          driverProposedMatches();
          driverConfirmedMatches();

        }
      }
    }
  };
}

function driverInfo () {
//http://localhost:8000/driver-exists?UUID=32e5cbd4-1342-4e1e-9076-0147e779a796&DriverPhone=Test

  var url = 
    remoteUrl + '/driver-info?' + 
    'UUID=' + data.uuid +
    '&DriverPhone=' + data.phone;

  var request = new XMLHttpRequest();

  request.open("GET", url);
  request.send();

  request.onreadystatechange = function () {
    if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      console.log(request.responseText);

      var resp = JSON.parse(request.responseText);

      var keys = Object.keys(resp);
      if (keys) {

        if (keys[0] == "driver_info" ) {
          
          var driverInfo = resp[keys[0]];
          var i = 0;


$("#driverInfo ul").append('<li>' + driverInfo.DriverFirstName + '</li>');
$("#driverInfo ul").append('<li>' + driverInfo.DriverLastName + '</li>');
$("#driverInfo ul").append('<li>' + driverInfo.UUID + '</li>');
$("#driverInfo ul").append('<li>' + driverInfo.DriverCollectionZIP + '</li>');
$("#driverInfo ul").append('<li>' + driverInfo.DriverEmail + '</li>');
$("#driverInfo ul").append('<li>' + driverInfo.DriverPhone + '</li>');
$("#driverInfo ul").append('<li>' + driverInfo.DriverLicenseNumber + '</li>');

        }
      }
    }
  };
}

function acceptDriverMatch(UUID_driver, UUID_rider, Score, DriverPhone) {

  var acceptUrl = remoteUrl + '/accept-driver-match?UUID_driver=' + UUID_driver +
                            '&UUID_rider=' + UUID_rider + 
                            '&Score=' + Score + 
                            '&DriverPhone=' + DriverPhone;

  var request = new XMLHttpRequest();

  request.open("GET", acceptUrl);
  request.send();

  request.onreadystatechange = function () {
    if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      console.log(request.responseText);

      var resp = JSON.parse(request.responseText);

      var keys = Object.keys(resp);
      if (keys) {
        info = resp[keys[0]].toString();
        // $info.text(info);
        $infoLogin.text(info);

        if (keys[0] == "driver_accept_match" && info === "") {
          // driverLoggedIn = true;

          // $(this).slideUp(300).attr('aria-hidden','true');
          // $manage.slideDown(300).attr('aria-hidden','false');
          // updateUI();

          // driverInfo();
          driverProposedMatches();
          driverConfirmedMatches();
        }
      }
    }
  };

}

function driverProposedMatches () {
//http://localhost:8000/driver-exists?UUID=32e5cbd4-1342-4e1e-9076-0147e779a796&DriverPhone=Test

  var url = 
    remoteUrl + '/driver-proposed-matches?' + 
    'UUID=' + data.uuid +
    '&DriverPhone=' + data.phone;

  var request = new XMLHttpRequest();

  request.open("GET", url);
  request.send();

  request.onreadystatechange = function () {
    if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      console.log(request.responseText);

      var resp = JSON.parse(request.responseText);

      resp.forEach(val => {
// var acceptUrl = remoteUrl + '/accept-driver-match?UUID_driver=' + val.driver_proposed_matches.uuid_driver +
//                             '&UUID_rider=' + val.driver_proposed_matches.uuid_rider + 
//                             '&Score=' + val.driver_proposed_matches.score + 
//                             '&DriverPhone=' + data.phone;
var btnFn = "acceptDriverMatch(" + 
  val.driver_proposed_matches.uuid_driver + ', ' + 
  val.driver_proposed_matches.uuid_rider  + ', ' +
  val.driver_proposed_matches.score       + ', ' +
  data.phone + ")";

var buttonInList = 
  '<button class="button" onclick="' + 
  btnFn + 
  '">Accept</button>';
                        
          $("#driverProposedMatches ul").append('<li> UUID_driver - ' + val.driver_proposed_matches.uuid_driver + '</li>');
  $("#driverProposedMatches ul").append('<li>  UUID_rider - ' + val.driver_proposed_matches.uuid_rider + '</li>');
  $("#driverProposedMatches ul").append('<li> Score - ' + val.driver_proposed_matches.score + '</li>');
  // $("#driverProposedMatches ul").append('<li> Accept - <a href="' + acceptUrl + '">Accept</a></li>');
  $("#driverProposedMatches ul").append('<li>' + buttonInList + '</li>');
  $("#driverProposedMatches ul").append('<li> </li>');

// https://api.carpoolvote.com/v2.0/accept-driver-match?UUID_driver=1e6e274d-ad33-4127-9f02-f35b48a07897&UUID_rider=1e6e274d-ad33-4127-9f02-f35b48a07897&Score=123&DriverPhone=123

      });

    }
  };
}

function driverConfirmedMatches () {
//http://localhost:8000/driver-exists?UUID=32e5cbd4-1342-4e1e-9076-0147e779a796&DriverPhone=Test

  var url = 
    remoteUrl + '/driver-confirmed-matches?' + 
    'UUID=' + data.uuid +
    '&DriverPhone=' + data.phone;

  var request = new XMLHttpRequest();

  request.open("GET", url);
  request.send();

  request.onreadystatechange = function () {
    if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      console.log(request.responseText);

      var resp = JSON.parse(request.responseText);

      resp.forEach(val => {

          $("#driverConfirmedMatches ul").append('<li> UUID_driver - ' + val.driver_confirmed_matches.uuid_driver + '</li>');
  $("#driverConfirmedMatches ul").append('<li>  UUID_rider - ' + val.driver_confirmed_matches.uuid_rider + '</li>');
  $("#driverConfirmedMatches ul").append('<li> Score - ' + val.driver_confirmed_matches.score + '</li>');

      });

    }
  };
}

function riderExists () {
//http://localhost:8000/rider-exists?UUID=32e5cbd4-1342-4e1e-9076-0147e779a796&RiderPhone=Test

  var url = 
    remoteUrl + '/rider-exists?' + 
    'UUID=' + data.uuid +
    '&RiderPhone=' + data.phone;

  var request = new XMLHttpRequest();

  request.open("GET", url);
  request.send();

  request.onreadystatechange = function () {
    if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      console.log(request.responseText);

      var resp = JSON.parse(request.responseText);

      var keys = Object.keys(resp);
      if (keys) {
        info = resp[keys[0]].toString();
        // $info.text(info);
        $infoLogin.text(info);

        if (keys[0] == "rider_exists" && info === "") {
          riderLoggedIn = true;

          $(this).slideUp(300).attr('aria-hidden','true');
          $manage.slideDown(300).attr('aria-hidden','false');
          updateUI();

          riderInfo();
          riderConfirmedMatch();
        }
      }
    }
  };
}

function riderInfo () {
//http://localhost:8000/rider-exists?UUID=32e5cbd4-1342-4e1e-9076-0147e779a796&RiderPhone=Test

  var url = 
    remoteUrl + '/rider-info?' + 
    'UUID=' + data.uuid +
    '&RiderPhone=' + data.phone;

  var request = new XMLHttpRequest();

  request.open("GET", url);
  request.send();

  request.onreadystatechange = function () {
    if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      console.log(request.responseText);

      var resp = JSON.parse(request.responseText);

      var keys = Object.keys(resp);
      if (keys) {

        if (keys[0] == "rider_info" ) {
          
          var riderInfo = resp[keys[0]];
          var i = 0;

$("#riderInfo ul").append('<li>' + riderInfo.RiderFirstName + '</li>');
$("#riderInfo ul").append('<li>' + riderInfo.RiderLastName + '</li>');
$("#riderInfo ul").append('<li>' + riderInfo.UUID + '</li>');
$("#riderInfo ul").append('<li>' + riderInfo.RiderCollectionZIP + '</li>');
$("#riderInfo ul").append('<li>' + riderInfo.RiderEmail + '</li>');
$("#riderInfo ul").append('<li>' + riderInfo.RiderPhone + '</li>');

          
        }
      }
    }
  };
}

function riderConfirmedMatch () {
//http://localhost:8000/rider-confirmed-match?UUID=32e5cbd4-1342-4e1e-9076-0147e779a796&DriverPhone=Test

  var url = 
    remoteUrl + '/rider-confirmed-match?' + 
    'UUID=' + data.uuid +
    '&RiderPhone=' + data.phone;

  var request = new XMLHttpRequest();

  request.open("GET", url);
  request.send();

  request.onreadystatechange = function () {
    if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      console.log(request.responseText);

      var resp = JSON.parse(request.responseText);

      if (resp.rider_confirmed_match.uuid_driver !== null) {
        $("#riderConfirmedMatch ul").append('<li> UUID_driver - ' + resp.rider_confirmed_match.uuid_driver + '</li>');
        $("#riderConfirmedMatch ul").append('<li>  UUID_rider - ' + resp.rider_confirmed_match.uuid_rider + '</li>');
        $("#riderConfirmedMatch ul").append('<li> Score - ' + resp.rider_confirmed_match.score + '</li>');
      }
    }
  };
}


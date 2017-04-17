var remoteUrl = "https://api.carpoolvote.com/live";
// var remoteUrl = "http://localhost:8000";

var driverLoggedIn = false;
var riderLoggedIn = false;

// Create a data object containing all URL query string data:
var data = tinyQuery.getAll();


// NOTE: for future refactoring,
//       this test is wrong. This page may receive both uuid_driver and uuid_rider.
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
    $manage.find('#riderInfo').toggle(false);
    $manage.find('#riderConfirmedMatch').toggle(false);

    driverExists();
  }
  else {
    $manage.find('#driverInfo').toggle(false);
    $manage.find('#driverProposedMatches').toggle(false);
    $manage.find('#driverConfirmedMatches').toggle(false);

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
  $manage.find('#btnPauseDriverMatch').toggle(data.type === 'driver');
  $manage.find('#btnCancelDriverMatch').toggle(data.type === 'rider' && data.uuid_driver !== undefined && data.score !== 'undefined');

  $manage.find('#btnCancelRideRequest').toggle(data.type === 'rider');
  $manage.find('#btnCancelRiderMatch').toggle(data.type === 'rider' && data.uuid_driver !== undefined && data.score !== 'undefined');

  $manage.find('#btnAcceptDriverMatch').toggle(data.type === 'rider' && data.uuid_driver !== undefined && data.score !== 'undefined');
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
      UUID: data.uuid,
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
      UUID: data.uuid,
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
      UUID: data.uuid,
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

function clearDriverInfo () {
  $('#driverInfo li').remove();
  $('#driverProposedMatches li').remove();
  $('#driverConfirmedMatches li').remove();
}

function clearRiderInfo () {
  $('#riderInfo li').remove();
  $('#riderConfirmedMatch li').remove();
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

          clearDriverInfo ();

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
          var listSelector = "#driverInfo ul";

          $(listSelector).append('<li>' + driverInfo.DriverFirstName + '</li>');
          $(listSelector).append('<li>' + driverInfo.DriverLastName + '</li>');
          $(listSelector).append('<li>' + driverInfo.UUID + '</li>');
          $(listSelector).append('<li>' + driverInfo.DriverCollectionZIP + '</li>');
          $(listSelector).append('<li>' + driverInfo.DriverEmail + '</li>');
          $(listSelector).append('<li>' + driverInfo.DriverPhone + '</li>');
          $(listSelector).append('<li>' + driverInfo.DriverLicenseNumber + '</li>');
        }
      }
    }
  };
}

function acceptDriverMatchFromButton (UUID_driver, UUID_rider, Score, DriverPhone) {

  var acceptUrl = remoteUrl + '/accept-driver-match?UUID_driver='   + UUID_driver +
                                                    '&UUID_rider='  + UUID_rider +
                                                    '&Score='       + Score +
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
        $info.text(info);
        // $infoLogin.text(info);

        if (keys[0] == "driver_confirm_match" && info === "") {
          clearDriverInfo ();

          driverProposedMatches();
          driverConfirmedMatches();
        }
      }
    }
  };
}

function cancelDriverMatchFromButton (UUID_driver, UUID_rider, Score, DriverPhone) {

  if (!window.confirm('This will cancel your match. Are you sure you want to proceed?')) {
    return;
  }

  var cancelUrl = remoteUrl + '/cancel-driver-match?UUID_driver='   + UUID_driver +
                                                    '&UUID_rider='  + UUID_rider +
                                                    '&Score='       + Score +
                                                    '&DriverPhone=' + DriverPhone;

  var request = new XMLHttpRequest();

  request.open("GET", cancelUrl);
  request.send();

  request.onreadystatechange = function () {
    if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      console.log(request.responseText);

      var resp = JSON.parse(request.responseText);

      var keys = Object.keys(resp);
      if (keys) {
        info = resp[keys[0]].toString();
        $info.text(info);
        // $infoLogin.text(info);

        if (keys[0] == "driver_cancel_confirmed_match" && info === "") {
          clearDriverInfo ();

          driverProposedMatches();
          driverConfirmedMatches();
        }
      }
    }
  };
}

function cancelRiderMatchFromButton (UUID_driver, UUID_rider, Score, RiderPhone) {

  if (!window.confirm('This will cancel your match. Are you sure you want to proceed?')) {
    return;
  }

  var cancelUrl = remoteUrl + '/cancel-rider-match?UUID_driver='   + UUID_driver +
                                                    '&UUID_rider='  + UUID_rider +
                                                    '&Score='       + Score +
                                                    '&RiderPhone='  + RiderPhone;

  var request = new XMLHttpRequest();

  request.open("GET", cancelUrl);
  request.send();

  request.onreadystatechange = function () {
    if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      console.log(request.responseText);

      var resp = JSON.parse(request.responseText);

      var keys = Object.keys(resp);
      if (keys) {
        info = resp[keys[0]].toString();
        $info.text(info);
        // $infoLogin.text(info);

        if (keys[0] == "rider_cancel_confirmed_match" && info === "") {
          clearRiderInfo();

          riderInfo();
          riderConfirmedMatch();
        }
      }
    }
  };
}

function createListButton (dbFunctionName, buttonCaption, buttonClass,
                                  uuid_driver, uuid_rider, score, phone) {
  var btnFn = dbFunctionName + "('" +
                                  uuid_driver + "', '" +
                                  uuid_rider  + "', " +
                                  score       + ", '" +
                                  phone + "')";

  return  '<button ' + buttonClass + ' onclick="' +
          btnFn +
          '">' + buttonCaption + '</button>';
}

function driverProposedMatches () {
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

        var acceptButtonInList =
          createListButton("acceptDriverMatchFromButton", "Accept", ' class="button" ',
            val.driver_proposed_matches.uuid_driver, val.driver_proposed_matches.uuid_rider,
            val.driver_proposed_matches.score, data.phone);
        var listSelector = "#driverProposedMatches ul";


        $(listSelector).append('<li> UUID_driver - ' + val.driver_proposed_matches.uuid_driver + '</li>');
        $(listSelector).append('<li>  UUID_rider - ' + val.driver_proposed_matches.uuid_rider + '</li>');
        $(listSelector).append('<li> Score - ' + val.driver_proposed_matches.score + '</li>');
        $(listSelector).append('<li class="match-info-item">  rider name - ' + val.driver_proposed_matches.RiderFirstName + ' ' + val.driver_proposed_matches.RiderLastName + '</li>');
        $(listSelector).append('<li class="match-info-item">  rider phone - ' + val.driver_proposed_matches.RiderPhone + '</li>');
        $(listSelector).append('<li class="match-info-item">  rider email - ' + val.driver_proposed_matches.RiderEmail + '</li>');
        $(listSelector).append('<li class="match-info-item">  rider collection - ' + val.driver_proposed_matches.RiderCollectionZIP + ' ' + val.driver_proposed_matches.RiderCollectionAddress + '</li>');
        $(listSelector).append('<li class="match-info-item">  rider drop off - ' + val.driver_proposed_matches.RiderDropOffZIP + ' ' + val.driver_proposed_matches.RiderDestinationAddress + '</li>');
        $(listSelector).append('<li class="match-info-item">  rider contact method, notes - ' + val.driver_proposed_matches.RiderPreferredContact + ' ' + val.driver_proposed_matches.RiderAccommodationNotes + '</li>');
        // $(listSelector).append('<li> Accept - <a href="' + acceptUrl + '">Accept</a></li>');
        $(listSelector).append('<li class="list_button">' + acceptButtonInList + '</li>');
        // $(listSelector).append('<li> (after clicking Accept, refresh browser page) </li>');
        

        // https://api.carpoolvote.com/v2.0/accept-driver-match?UUID_driver=1e6e274d-ad33-4127-9f02-f35b48a07897&UUID_rider=1e6e274d-ad33-4127-9f02-f35b48a07897&Score=123&DriverPhone=123
      });
    }
  };
}

function driverConfirmedMatches () {
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

        var cancelButtonInList =  createListButton("cancelDriverMatchFromButton", "Cancel", ' class="button button--danger" ',
            val.driver_confirmed_matches.uuid_driver, val.driver_confirmed_matches.uuid_rider,
            val.driver_confirmed_matches.score, data.phone);
        var listSelector = "#driverConfirmedMatches ul";

        var tmpList = '';

        $(listSelector).append('<li> UUID_driver - ' + val.driver_confirmed_matches.uuid_driver + '</li>');
        $(listSelector).append('<li>  UUID_rider - ' + val.driver_confirmed_matches.uuid_rider + '</li>');
        $(listSelector).append('<li> Score - ' + val.driver_confirmed_matches.score + '</li>');
        $(listSelector).append('<li class="match-info-item">  rider name - ' + val.driver_confirmed_matches.RiderFirstName + ' ' + val.driver_confirmed_matches.RiderLastName + '</li>');
        $(listSelector).append('<li class="match-info-item">  rider phone - ' + val.driver_confirmed_matches.RiderPhone + '</li>');
        $(listSelector).append('<li class="match-info-item">  rider email - ' + val.driver_confirmed_matches.RiderEmail + '</li>');
        $(listSelector).append('<li class="match-info-item">  rider collection - ' + val.driver_confirmed_matches.RiderCollectionZIP + ' ' + val.driver_confirmed_matches.RiderCollectionAddress + '</li>');
        $(listSelector).append('<li class="match-info-item">  rider drop off - ' + val.driver_confirmed_matches.RiderDropOffZIP + ' ' + val.driver_confirmed_matches.RiderDestinationAddress + '</li>');
        $(listSelector).append('<li class="match-info-item">  rider contact method, notes - ' + val.driver_confirmed_matches.RiderPreferredContact + ' ' + val.driver_confirmed_matches.RiderAccommodationNotes + '</li>');
        $(listSelector).append('<li class="list_button">' + cancelButtonInList + '</li>');
        // $(listSelector).append('<li> (after clicking Cancel, refresh browser page) </li>');

        // https://api.carpoolvote.com/v2.0/cancel-driver-match?UUID_driver=1e6e274d-ad33-4127-9f02-f35b48a07897&UUID_rider=1e6e274d-ad33-4127-9f02-f35b48a07897&Score=123&DriverPhone=123
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

          clearRiderInfo ();

          riderInfo();
          riderConfirmedMatch();
        }
      }
    }
  };
}

function riderInfo () {
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

          var riderInfoList = [riderInfo.RiderFirstName, riderInfo.RiderLastName, riderInfo.UUID, riderInfo.RiderCollectionZIP, riderInfo.RiderEmail, riderInfo.RiderPhone];
          var tempList = '';

          for(let i = 0; i < riderInfoList.length; i++) {
            li = '<li>' + riderInfoList[i] + '</li>';
            tempList += li;
          }

          $("#riderInfo ul").append(tempList);
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

      var cancelButtonInList =  createListButton("cancelRiderMatchFromButton", "Cancel", ' class="button button--danger" ',
            resp.rider_confirmed_match.uuid_driver, resp.rider_confirmed_match.uuid_rider,
            resp.rider_confirmed_match.score, data.phone);

      if (resp.rider_confirmed_match.uuid_driver !== null) {
        var listSelector = "#riderConfirmedMatch ul";

        $(listSelector).append('<li> UUID_driver - ' + resp.rider_confirmed_match.uuid_driver + '</li>');
        $(listSelector).append('<li>  UUID_rider - ' + resp.rider_confirmed_match.uuid_rider + '</li>');
        $(listSelector).append('<li> Score - ' + resp.rider_confirmed_match.score + '</li>');
        $(listSelector).append('<li>  driver name - ' + resp.rider_confirmed_match.DriverFirstName + ' ' + resp.rider_confirmed_match.DriverLastName + '</li>');
        $(listSelector).append('<li>  driver phone - ' + resp.rider_confirmed_match.DriverPhone + '</li>');
        $(listSelector).append('<li>  driver email - ' + resp.rider_confirmed_match.DriverEmail + '</li>');
        $(listSelector).append('<li>' + cancelButtonInList + '</li>');
        // $(listSelector).append('<li> (after clicking Cancel, refresh browser page) </li>');
        $(listSelector).append('<li> </li>');
      }
    }
  };
}

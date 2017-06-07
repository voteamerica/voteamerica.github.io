if (!remoteUrl) {
  var remoteUrl = "https://api.carpoolvote.com/live";
}

var driverLoggedIn = false;
var riderLoggedIn = false;

var driverCancelledStatus = "Canceled";

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
  // NOTE: this handling isn't quite correct, so avoid refactoring without full testing
  var dataTypeDriver = data.type === 'driver';
  var dataTypeRider  = data.type === 'rider';

  $manage.find('#btnCancelDriveOffer').toggle(dataTypeDriver);
  $manage.find('#btnPauseDriverMatch').toggle(dataTypeDriver);
  $manage.find('#btnCancelDriverMatch').toggle(dataTypeRider && data.uuid_driver !== undefined && data.score !== 'undefined');

  $manage.find('#btnCancelRideRequest').toggle(dataTypeRider);
  $manage.find('#btnCancelRiderMatch').toggle(dataTypeRider && data.uuid_driver !== undefined && data.score !== 'undefined');

  $manage.find('#btnAcceptDriverMatch').toggle(dataTypeRider && data.uuid_driver !== undefined && data.score !== 'undefined');
}

function updateUIbyDriverStatus (driverStatus) {
  var driverNotCancelled = driverStatus !== driverCancelledStatus;

  $manage.find('#btnCancelDriveOffer').toggle(driverNotCancelled);
  $manage.find('#btnPauseDriverMatch').toggle(driverNotCancelled);
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
  // (please leave this comment here, thanks)
  // Generate url based on url stub, path (API action) and data (parameters)
  // e.g. http://localhost:8000/cancel-ride-request?
  //        UUID=8f32bb40-512a-4676-bca1-455f8ffb68d9&RiderPhone=test
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
        var info = resp[keys[0]].toString();
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

          if (driverInfo.status != undefined && driverInfo.status === driverCancelledStatus) {
            
            updateUIbyDriverStatus(driverInfo.status);

            $(listSelector).append('<li><strong>' + driverInfo.status.toUpperCase() + '</strong></li>');            
          }

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

function processDbInfo (info) {
  // info has the format "(0,"")"

  var infoItems = {};

  var characters = info.split('');

  var data = characters.filter( function (item) {
    return item != '(' && item != ')' && item != '"' ; 
  });

  data = data.join('');

  var items = data.split(',');

  if (items[0] != undefined && items[0] != null) {
    infoItems.code = items[0];
  }
  else {
    infoItems.code = -1;
  }

  if (items[1] != undefined && items[1] != null) {
    infoItems.description = items[1];    
  }
  else {
    infoItems.code = "no response from server - please contact phone support";
  } 

  return infoItems;
}

function driverPageUpdate () {
  clearDriverInfo ();

  driverInfo();
  driverProposedMatches();
  driverConfirmedMatches();
}

function riderPageUpdate () {
  clearRiderInfo();

  riderInfo();
  riderConfirmedMatch();
}

function handleMatchActionResponse (response, $info, expectedKey, successCode, errorPrefix, pageUpdateFn) {
  var keys = Object.keys(response);
  var firstKey = keys[0];
  var dbDescription = "";
  var dbInfo;

  if (keys) {
    var info = response[firstKey].toString(); 

    dbInfo = processDbInfo(info);

    if (firstKey === expectedKey) {
      if (dbInfo.code === successCode) {
        dbDescription = dbInfo.description;

        pageUpdateFn();
      }
      else {
        dbDescription = errorPrefix + dbInfo.description;
      }
    }

    $info.text(dbDescription);
  }
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

      var response = JSON.parse(request.responseText);

      handleMatchActionResponse
        (response, $info, 
          "driver_confirm_match", "0", "Error: ", 
          driverPageUpdate);
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

      var response = JSON.parse(request.responseText);

      handleMatchActionResponse
        (response, $info, 
          "driver_cancel_confirmed_match", "0", "Error: ", 
          driverPageUpdate);
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

      var response = JSON.parse(request.responseText);

      handleMatchActionResponse
        (response, $info, 
          "rider_cancel_confirmed_match", "0", "Error: ", 
          riderPageUpdate);
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
        // $(listSelector).append('<li class="match-info-item">  rider name - ' + val.driver_proposed_matches.RiderFirstName + ' ' + val.driver_proposed_matches.RiderLastName + '</li>');
        // $(listSelector).append('<li class="match-info-item">  rider phone - ' + val.driver_proposed_matches.RiderPhone + '</li>');
        // $(listSelector).append('<li class="match-info-item">  rider email - ' + val.driver_proposed_matches.RiderEmail + '</li>');
        $(listSelector).append('<li class="match-info-item">  rider collection - ' + val.driver_proposed_matches.RiderCollectionZIP + ' ' + val.driver_proposed_matches.RiderCollectionAddress + '</li>');
        $(listSelector).append('<li class="match-info-item">  rider drop off - ' + val.driver_proposed_matches.RiderDropOffZIP + ' ' + val.driver_proposed_matches.RiderDestinationAddress + '</li>');
        $(listSelector).append('<li class="match-info-item">  rider contact method, notes - ' + val.driver_proposed_matches.RiderPreferredContact + ' ' + val.driver_proposed_matches.RiderAccommodationNotes + '</li>');
        $(listSelector).append('<li class="list_button">' + acceptButtonInList + '</li>');
       
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
        var info = resp[keys[0]].toString();
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
        $(listSelector).append('<li class="match-info-item">  driver name - ' + resp.rider_confirmed_match.DriverFirstName + ' ' + resp.rider_confirmed_match.DriverLastName + '</li>');
        $(listSelector).append('<li class="match-info-item">  driver phone - ' + resp.rider_confirmed_match.DriverPhone + '</li>');
        $(listSelector).append('<li class="match-info-item">  driver email - ' + resp.rider_confirmed_match.DriverEmail + '</li>');
        $(listSelector).append('<li class="list_button">' + cancelButtonInList + '</li>');
      }
    }
  };
}

function cancelDriveOffer() {
  if (!window.confirm('This will cancel your ride offer. Are you sure you want to proceed?')) {
    return;
  }

  accessCarpoolvoteAPI(
    createAPIurl({
        UUID: data.uuid,
        DriverPhone: data.phone
      },
      '/cancel-drive-offer'
    ),                                                     
    function (response) {
      handleMatchActionResponse
        (response, $info, 
          "driver_cancel_drive_offer", "0", "Error: ",
          driverPageUpdate);
    });
  // .fail(function(err) {
  //   $info.text('⚠️ ' + err.statusText);
  // });
}

// dev artifact, to be removed
function handleActionResponse (response, $info, successCode, errorPrefix, pageUpdateFn) {
  var keys = Object.keys(response);
  var firstKey = keys[0];
  var dbDescription = "";
  var dbInfo;

  if (keys) {
    // info = dbInfo[keys[0]].toString();
    // $info.text('ℹ️ ' + info);

    var info = response[firstKey].toString(); 

    dbInfo = processDbInfo(info);

    if (dbInfo.code === successCode) {
      dbDescription = dbInfo.description;

      pageUpdateFn();
    }
    else {
      dbDescription = errorPrefix + dbInfo.description;
    }

    $info.text('ℹ️ ' + dbDescription);
  }
}

function createAPIurl (params, apiRoute) {
  var url = "";

  var keys = Object.keys(params);

  keys.forEach(function (key, idx) {
    if (idx > 0) {
      url += "&";
    }
    url += key + "=" + params[key].toString();    
  });

  url = remoteUrl + apiRoute + "?" + url;

  return url;
}

function accessCarpoolvoteAPI (url, handlerFunction) {
  var request = new XMLHttpRequest();

  request.open("GET", url);

  request.onreadystatechange = handlerDoneCheck;

  request.send();

  function handlerDoneCheck () {
    if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      console.log(request.responseText);

      var resp = JSON.parse(request.responseText);

      handlerFunction(resp);
    }
  }
}

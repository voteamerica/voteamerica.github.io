if (!remoteUrl) {
  var remoteUrl = "https://api.carpoolvote.com/live";
}

var driverLoggedIn = false;
var riderLoggedIn = false;

var RIDER_CANCELLED_STATUS  = "Canceled";
var DRIVER_CANCELLED_STATUS = "Canceled";
var DRIVER_PAUSED_TEXT = "Paused Notifications";
var DB_SUCCESS_CODE = "0";
var DB_ERROR_PREFIX = "Error: ";

var DRIVER_PAUSE_BUTTON_TEXT = "Pause Driver Match Request";
var DRIVER_RESUME_BUTTON_TEXT = "Resume Driver Match Request";

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
var $login      = $('#login'),
  $manage       = $('#manage'),
  $info         = $('#manage #infoAdmin'),
  $manageLogin  = $('#manageLogin'),
  $infoLogin    = $('#manageLogin #infoLogin')
  ;


if (data.uuid) {
  $login.find('#enter-uuid').remove();
}
if (data.type) {
  $login.find('#enter-type').remove();
}

if (data.phone) {
  const phoneEntry = document.getElementById('enter-phone');

  phoneEntry.remove();
}


$login.validator().on('submit', function(e) {
  if (e.isDefaultPrevented()) {
    return;
  }
  data.uuid = data.uuid || $(this).find('#inputUUID').val();
  data.type = data.type || $(this).find('#enter-type').find('input:checked').val();
  data.phone = data.phone || $(this).find('#inputPhoneNumber').val();

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
  var driverNotCancelled = driverStatus !== DRIVER_CANCELLED_STATUS;

  $manage.find('#btnCancelDriveOffer').toggle(driverNotCancelled);
  $manage.find('#btnPauseDriverMatch').toggle(driverNotCancelled);
}

function updateUIbyDriverReadyToMatch (readyToMatch) {
  $manage.find('#btnPauseDriverMatch').toggle(readyToMatch);
}

function updateUIbyRiderStatus (riderStatus) {
  var riderNotCancelled = riderStatus !== RIDER_CANCELLED_STATUS;

  $manage.find('#btnCancelRideRequest').toggle(riderNotCancelled);
}

$manage
  .on('click', '#btnCancelRideRequest', cancelRideRequest)
  .on('click', '#btnCancelRiderMatch', cancelRiderMatch)
  .on('click', '#btnCancelDriveOffer', cancelDriveOffer)
  .on('click', '#btnCancelDriverMatch', cancelDriverMatch)
  .on('click', '#btnPauseDriverMatch', pauseDriverMatch)
  .on('click', '#btnAcceptDriverMatch', acceptDriverMatch)
  .on('click', '#logout', logout);


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

  accessCarpoolvoteAPI(    
    createAPIurl({
        UUID: data.uuid,
        DriverPhone: data.phone
      },
      '/driver-info'
    ), 
    function (resp) {
      var keys = Object.keys(resp);
      if (keys) {

        if (keys[0] == "driver_info" ) {
          var driverInfo        = resp[keys[0]];
          var listItems          = '';
          var li                = "";
          var listSelector      = "#driverInfo ul";
          var infoListCaptions  = ["First Name", "Last Name", "UUID", "Collection ZIP", "Email", "Phone", "License Number"];
          var driverInfoList     = [driverInfo.DriverFirstName, driverInfo.DriverLastName, driverInfo.UUID, driverInfo.DriverCollectionZIP, driverInfo.DriverEmail, driverInfo.DriverPhone, driverInfo.DriverLicenseNumber];

          if (driverInfo.status != undefined && driverInfo.status === DRIVER_CANCELLED_STATUS) {
            
            updateUIbyDriverStatus(driverInfo.status);

            li = '<li><strong>' + driverInfo.status.toUpperCase() + '</strong></li>';
          }

          listItems += li;

          if (driverInfo.ReadyToMatch != undefined && driverInfo.ReadyToMatch === false) {
            
            updateUIbyDriverReadyToMatch(driverInfo.ReadyToMatch);

            li = '<li><strong>' + DRIVER_PAUSED_TEXT.toUpperCase() + '</strong></li>';
          }

          listItems += li;

          listItems += createListItems(infoListCaptions, driverInfoList);

          $(listSelector).append(listItems);
        }
      }
    });
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
          "driver_confirm_match", DB_SUCCESS_CODE, DB_ERROR_PREFIX, 
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
          "driver_cancel_confirmed_match", DB_SUCCESS_CODE, DB_ERROR_PREFIX, 
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
          "rider_cancel_confirmed_match", DB_SUCCESS_CODE, DB_ERROR_PREFIX, 
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
  // var url =
  //   remoteUrl + '/driver-proposed-matches?' +
  //   'UUID=' + data.uuid +
  //   '&DriverPhone=' + data.phone;

  accessCarpoolvoteAPI(
    createAPIurl({
        UUID: data.uuid,
        DriverPhone: data.phone
      },
      '/driver-proposed-matches'
    ), 
  
  function (resp) {
      resp.forEach(match => {
        var listItems           = '';
        var li                  = "";
        var infoListCaptions    = 
              [ "UUID_driver", "UUID_rider"
            , "Rider Collection Zip/Address", "Rider Drop-off Zip/Address", "Rider Contact Method(s)", "Rider Notes"
              ];
        var matchInfoList       = 
          [ match.driver_proposed_matches.uuid_driver
          , match.driver_proposed_matches.uuid_rider
          , match.driver_proposed_matches.RiderCollectionZIP + ' ' + match.driver_proposed_matches.RiderCollectionAddress
          , match.driver_proposed_matches.RiderDropOffZIP + ' ' + match.driver_proposed_matches.RiderDestinationAddress
          , match.driver_proposed_matches.RiderPreferredContact 
          , match.driver_proposed_matches.RiderAccommodationNotes
          ];

        var listSelector = "#driverProposedMatches ul";
        var acceptButtonInList =
          createListButton("acceptDriverMatchFromButton", "Accept", ' class="button self-service-list-button" ',
            match.driver_proposed_matches.uuid_driver, match.driver_proposed_matches.uuid_rider,
            match.driver_proposed_matches.score, data.phone);

        // $(listSelector).append('<li>UUID_driver - ' + match.driver_proposed_matches.uuid_driver + '</li>');
        // $(listSelector).append('<li>UUID_rider - ' + match.driver_proposed_matches.uuid_rider + '</li>');
        // // $(listSelector).append('<li class="match-info-item">  rider name - ' + match.driver_proposed_matches.RiderFirstName + ' ' + match.driver_proposed_matches.RiderLastName + '</li>');
        // // $(listSelector).append('<li class="match-info-item">  rider phone - ' + match.driver_proposed_matches.RiderPhone + '</li>');
        // // $(listSelector).append('<li class="match-info-item">  rider email - ' + match.driver_proposed_matches.RiderEmail + '</li>');
        // $(listSelector).append('<li class="match-info-item">  rider collection - ' + match.driver_proposed_matches.RiderCollectionZIP + ' ' + match.driver_proposed_matches.RiderCollectionAddress + '</li>');
        // $(listSelector).append('<li class="match-info-item">  rider drop off - ' + match.driver_proposed_matches.RiderDropOffZIP + ' ' + match.driver_proposed_matches.RiderDestinationAddress + '</li>');
        // $(listSelector).append('<li class="match-info-item">  rider contact method, notes - ' + match.driver_proposed_matches.RiderPreferredContact + ' ' + match.driver_proposed_matches.RiderAccommodationNotes + '</li>');
        // $(listSelector).append('<li class="list_button">' + acceptButtonInList + '</li>');

        listItems += createListItems(infoListCaptions, matchInfoList);
        listItems += '<li class="list_button">' + acceptButtonInList + '</li>';

        $(listSelector).append(listItems);      

        // https://api.carpoolvote.com/v2.0/accept-driver-match?UUID_driver=1e6e274d-ad33-4127-9f02-f35b48a07897&UUID_rider=1e6e274d-ad33-4127-9f02-f35b48a07897&Score=123&DriverPhone=123
        // var acceptUrl = remoteUrl + '/accept-driver-match?UUID_driver=' + match.driver_proposed_matches.uuid_driver +
        //                             '&UUID_rider=' + match.driver_proposed_matches.uuid_rider +
        //                             '&Score=' + match.driver_proposed_matches.score +
        //                             '&DriverPhone=' + data.phone;
      });
  });
}

function driverConfirmedMatches () {
  // https://api.carpoolvote.com/v2.0/cancel-driver-match?UUID_driver=1e6e274d-ad33-4127-9f02-f35b48a07897&UUID_rider=1e6e274d-ad33-4127-9f02-f35b48a07897&Score=123&DriverPhone=123

  accessCarpoolvoteAPI(
    createAPIurl({
        UUID: data.uuid,
        DriverPhone: data.phone
      },
      '/driver-confirmed-matches'
    ), 
  
  function (resp) {
      resp.forEach(match => {
        var listItems           = '';
        var li                  = "";
        var infoListCaptions    = 
              [ "UUID_driver", "UUID_rider", "Rider Name", "Rider Phone", "Rider Email"
              , "Rider Collection Zip/Address", "Rider Drop-off Zip/Address", "Rider Contact Method and Notes"
              ];
        var matchInfoList       = 
          [ match.driver_confirmed_matches.uuid_driver
          , match.driver_confirmed_matches.uuid_rider
          , match.driver_confirmed_matches.RiderFirstName + ' ' + match.driver_confirmed_matches.RiderLastName
          , match.driver_confirmed_matches.RiderPhone
          , match.driver_confirmed_matches.RiderEmail
          , match.driver_confirmed_matches.RiderCollectionZIP + ' ' + match.driver_confirmed_matches.RiderCollectionAddress
          , match.driver_confirmed_matches.RiderDropOffZIP + ' ' + match.driver_confirmed_matches.RiderDestinationAddress
          , match.driver_confirmed_matches.RiderPreferredContact + ' ' + match.driver_confirmed_matches.RiderAccommodationNotes
          ];

        var listSelector = "#driverConfirmedMatches ul";
        var cancelButtonInList = 
              createListButton("cancelDriverMatchFromButton", 
                "Cancel", 
                ' class="button button--danger self-service-list-button" ',
                match.driver_confirmed_matches.uuid_driver, match.driver_confirmed_matches.uuid_rider,
                match.driver_confirmed_matches.score, data.phone);

        // var tmpList = '';

        // $(listSelector).append('<li> UUID_driver - ' + match.driver_confirmed_matches.uuid_driver + '</li>');
        // $(listSelector).append('<li>  UUID_rider - ' + match.driver_confirmed_matches.uuid_rider + '</li>');
        // $(listSelector).append('<li class="match-info-item">  rider name - ' + match.driver_confirmed_matches.RiderFirstName + ' ' + match.driver_confirmed_matches.RiderLastName + '</li>');
        // $(listSelector).append('<li class="match-info-item">  rider phone - ' + match.driver_confirmed_matches.RiderPhone + '</li>');
        // $(listSelector).append('<li class="match-info-item">  rider email - ' + match.driver_confirmed_matches.RiderEmail + '</li>');
        // $(listSelector).append('<li class="match-info-item">  rider collection - ' + match.driver_confirmed_matches.RiderCollectionZIP + ' ' + match.driver_confirmed_matches.RiderCollectionAddress + '</li>');
        // $(listSelector).append('<li class="match-info-item">  rider drop off - ' + match.driver_confirmed_matches.RiderDropOffZIP + ' ' + match.driver_confirmed_matches.RiderDestinationAddress + '</li>');
        // $(listSelector).append('<li class="match-info-item">  rider contact method, notes - ' + match.driver_confirmed_matches.RiderPreferredContact + ' ' + match.driver_confirmed_matches.RiderAccommodationNotes + '</li>');

        // $(listSelector).append('<li class="list_button">' + cancelButtonInList + '</li>');

        listItems += createListItems(infoListCaptions, matchInfoList);
        listItems += '<li class="list_button">' + cancelButtonInList + '</li>';

        $(listSelector).append(listItems);      
      });
    });
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

function createListItems (captions, details) {
  var listItemsFragment = '';

  var spanCaptions = captions.map(function (caption) {
    return "<span class='liLabel'>" + caption + "</span>"; 
  });

  var liTexts = details.map(function (infoItem, idx) {
    return spanCaptions[idx] + infoItem;
  });

  liItems = liTexts.map(function (value) {
    return '<li class="match-info-item">' + value + '</li>';
  });

  liItems.forEach(function (liItem) {
    listItemsFragment += liItem;
  });

  return listItemsFragment;
}

function riderInfo () {

  accessCarpoolvoteAPI(
    createAPIurl({
        UUID: data.uuid,
        RiderPhone: data.phone
      },
      '/rider-info'
    ), 
    function (resp) {
      var keys = Object.keys(resp);

      if (keys) {

        if (keys[0] == "rider_info" ) {
          var riderInfo         = resp[keys[0]];
          var listItems         = '';
          var li                = "";
          var infoListCaptions  = ["First Name", "Last Name", "UUID", "Collection ZIP", "Email", "Phone"];
          var riderInfoList     = [riderInfo.RiderFirstName, riderInfo.RiderLastName, riderInfo.UUID, riderInfo.RiderCollectionZIP, riderInfo.RiderEmail, riderInfo.RiderPhone];

          if (riderInfo.status != undefined && riderInfo.status === RIDER_CANCELLED_STATUS) {
            
            updateUIbyRiderStatus(riderInfo.status);

            li = '<li><strong>' + riderInfo.status.toUpperCase() + '</strong></li>';            
          }

          listItems += li;

          listItems += createListItems(infoListCaptions, riderInfoList);

          $("#riderInfo ul").append(listItems);
        }
      }
    });
}

function riderConfirmedMatch () {
//http://localhost:8000/rider-confirmed-match?UUID=32e5cbd4-1342-4e1e-9076-0147e779a796&DriverPhone=Test

  accessCarpoolvoteAPI(
    createAPIurl({
        UUID: data.uuid,
        RiderPhone: data.phone
      },
      '/rider-confirmed-match'
    ), 
  function (resp) {
      var listItems           = '';
      var li                  = "";
      var infoListCaptions    = ["UUID_driver", "UUID_rider", "Driver Name", "Driver Phone", "Driver Email"];
      var matchInfoList       = 
        [ resp.rider_confirmed_match.uuid_driver
        , resp.rider_confirmed_match.uuid_rider
        , resp.rider_confirmed_match.DriverFirstName + ' ' + resp.rider_confirmed_match.DriverLastName 
        , resp.rider_confirmed_match.DriverPhone 
        , resp.rider_confirmed_match.DriverEmail
        ];

      if (resp.rider_confirmed_match.uuid_driver !== null) {
        var listSelector        = "#riderConfirmedMatch ul";
        var cancelButtonInList  = 
          createListButton("cancelRiderMatchFromButton", 
            "Cancel", 
            ' class="button button--danger self-service-list-button" ',
            resp.rider_confirmed_match.uuid_driver, resp.rider_confirmed_match.uuid_rider,
            resp.rider_confirmed_match.score, data.phone);

        listItems += createListItems(infoListCaptions, matchInfoList);
        listItems += '<li class="list_button">' + cancelButtonInList + '</li>';

        $(listSelector).append(listItems);      
      }
  });
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
          "driver_cancel_drive_offer", DB_SUCCESS_CODE, DB_ERROR_PREFIX,
          driverPageUpdate);
    });
  // .fail(function(err) {
  //   $info.text('⚠️ ' + err.statusText);
  // });
}

function pauseDriverMatch() {

  accessCarpoolvoteAPI(
    createAPIurl({
        UUID: data.uuid,
        DriverPhone: data.phone
      },
      '/pause-driver-match'
    ),                                                     
    function (response) {
      handleMatchActionResponse
        (response, $info, 
          "driver_pause_match", DB_SUCCESS_CODE, DB_ERROR_PREFIX,
          driverPageUpdate);
    });
  // .fail(function(err) {
  //   $info.text('⚠️ ' + err.statusText);
  // });
}

function cancelRideRequest() {
  if (!window.confirm('This will cancel your ride request. Are you sure you want to proceed?')) {
    return;
  }

  accessCarpoolvoteAPI(
    createAPIurl({
        UUID: data.uuid,
        RiderPhone: data.phone
      },
      '/cancel-ride-request'
    ),                                                     
    function (response) {
      handleMatchActionResponse
        (response, $info, 
          "rider_cancel_ride_request", DB_SUCCESS_CODE, DB_ERROR_PREFIX,
          riderPageUpdate);
    });
  // .fail(function(err) {
  //   $info.text('⚠️ ' + err.statusText);
  // });
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

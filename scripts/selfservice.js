var remoteUrl = "https://api.carpoolvote.com/live";

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
  $info = $manage.find('#info');


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

  $(this).slideUp(300).attr('aria-hidden','true');
  $manage.slideDown(300).attr('aria-hidden','false');
  updateUI();
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
  sendAjaxRequest(
    {
      uuid: data.uuid,
      RiderPhone: data.phone
    },
    '/cancel-ride-request'
  );
}

function cancelRiderMatch() {
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
  sendAjaxRequest(
    {
      uuid: data.uuid,
      DriverPhone: data.phone
    },
    '/cancel-drive-offer'
  );
}

function cancelDriverMatch() {
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

if (!remoteUrl) {
  var remoteUrl = 'https://api.carpoolvote.com/live';
}

// Functions used by ReasonML components - start

const spreadObject = (source, key, value) => {
  const newObject = { ...source, [key]: value };
  // console.log(newObject);
  return newObject;
};

/**
 * Convert a single Availability Time row into a joined datetime string.
 * @param  {string} date - A date in YYYY-MM-DD format
 * @param  {string} startTime - A time in either 12 or 24-hour format
 * @param  {string} endTime - A time in either 12 or 24-hour format
 * @return {string} The datetime for a single row
 */
function formatAvailabilityPeriod(date, startTime, endTime) {
  return [startTime, endTime].map(function(time){
      return toISO8601((date || ''), time);
  }).join('/');
}

/**
 * Convert a date and time to ISO 8601 format
 * (See https://www.w3.org/TR/NOTE-datetime)
 * Uses complete date plus hours and minutes but no time-zone
 * @param  {string} date - In YYYY-MM-DD format
 * @param  {string} time - In either 12 or 24-hour format
 * @return {string} A date in YYYY-MM-DDThh-mm format
 */
function toISO8601(date, time) {
    return [date, to24Hour(time)].join('T');
}

/**
 * Convert a 12-hour time to 24-hour time
 * @param  {string} time - A time in either 12 or 24-hour format
 * @return {string} A time in 24-hour format
 */
function to24Hour(time) {
    if (!time) {
        return '';
    }
    var period = time.match(/[AP]M/);
    if (!period) {
        return time; // is 24 hour time already
    }
    var divisions = time.split(':'),
        hours = divisions[0],
        minutes = divisions[1];
    if (period.toString() === 'PM' && +hours !== 12) {
        hours = +hours + 12;
    }
    return [hours,minutes].join(':');
}

/**
 * Convert a date object to 'YYYY-MM-DD' format
 * @param  {object} date - A date object.
 * @return {string} An ISO-compliant YYYY-MM-DD date string
 */
function dateToYYYYMMDD(date) {
    var mm = date.getMonth() + 1;
    var dd = date.getDate();

    return [
        date.getFullYear(),
        mm<10 ? '0'+mm : mm,
        dd<10 ? '0'+dd : dd
    ].join('-');
}

// Functions used by ReasonML components - end


let token = '';

const $login = document.getElementById('loginSubmit');
const $username = document.getElementById('username');
const $password = document.getElementById('password');

const $getUsersList = document.getElementById('getUsersList');

const handleLoginClick = e => {
  e.preventDefault();

  const username = $username.value;
  const password = $password.value;

  getToken(username, password);
};

const handleGetUsersListClick = e => {
  getUsersList();
};

$login.onclick = handleLoginClick;
$getUsersList.onclick = handleGetUsersListClick;

const createAPIurl = (params, apiRoute) => {
  var url = '';

  var keys = Object.keys(params);

  keys.forEach(function(key, idx) {
    if (idx > 0) {
      url += '&';
    }
    url += key + '=' + params[key].toString();
  });

  url = remoteUrl + apiRoute + '?' + url;

  return url;
};

const accessCarpoolvoteAPI = (url, handlerFunction, useToken = false) => {
  var request = new XMLHttpRequest();

  request.open('GET', url);

  request.onreadystatechange = handlerDoneCheck;

  if (useToken === true) {
    request.setRequestHeader('Authorization', `Bearer ${token}`);
  }

  request.send();

  function handlerDoneCheck() {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      console.log(request.responseText);

      var resp = JSON.parse(request.responseText);

      handlerFunction(resp);
    }
  }
};

const getToken = (username, password) => {
  // //http://localhost:8000/users/authenticate?username=jk&password=123

  accessCarpoolvoteAPI(
    createAPIurl(
      {
        username,
        password
      },
      '/users/authenticate'
    ),
    resp => {
      const keys = Object.keys(resp);

      token = resp.id_token;
    }
  );
};

const getUsersList = () => {
  // //http://localhost:8000/users/authenticate?username=jk&password=123

  accessCarpoolvoteAPI(
    createAPIurl({}, '/users/list'),
    resp => {
      const keys = Object.keys(resp);

      token = resp.id_token;

      //       if (keys) {
      //         if (keys[0] == "driver_info" ) {
      //           var driverInfo        = resp[keys[0]];
      //         }
      //       }
    },
    true
  );
};

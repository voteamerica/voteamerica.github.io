if (!remoteUrl) {
  var remoteUrl = 'https://api.carpoolvote.com/live';
}

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

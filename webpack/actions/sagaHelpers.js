import { put, call } from 'redux-saga/effects';

const createAPIurl = (params, remoteUrl, apiRoute) => {
  let urlParams = '';

  const keys = Object.keys(params);

  keys.forEach(function(key, idx) {
    if (idx > 0) {
      urlParams += '&';
    }

    urlParams += key + '=' + params[key].toString();
  });

  const baseUrl = remoteUrl + apiRoute;

  const url = urlParams.length > 0 ? baseUrl + '?' + urlParams : baseUrl;

  return url;
};

const fetchInfo = async fetchDetails => {
  const options = {};

  if (fetchDetails.token && fetchDetails.token.length > 0) {
    options.headers = { Authorization: `Bearer ${fetchDetails.token}` };
  }

  const resp = await fetch(fetchDetails.fetchURL, options);

  console.log('resp', resp);

  const json = resp.json();

  return json;
};

const createFetchItemsList = (getItemsListTypes, urlPath) => {
  return function* fetchItemsList(action) {
    try {
      const { remoteUrlBase, token = '', successProperty } = action.payload;

      const fetchURL = createAPIurl({}, remoteUrlBase, urlPath);

      const loginResult = yield call(fetchInfo, { fetchURL, token });

      if (loginResult[successProperty] !== undefined) {
        const payload = {};

        const results = JSON.parse(loginResult[successProperty]);

        payload[successProperty] = results;

        yield put({
          type: getItemsListTypes.success,
          payload
        });
      } else {
        yield put({ type: getItemsListTypes.fail, payload: loginResult });
      }
    } catch (e) {
      yield put({
        type: getItemsListTypes.error,
        payload: { message: e.message }
      });
    }
  };
};

export { createAPIurl, fetchInfo, createFetchItemsList };

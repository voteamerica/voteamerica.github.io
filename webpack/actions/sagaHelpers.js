const axios = require('axios');
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

const baseFetchInfo = (options = {}) => async fetchDetails => {
  if (fetchDetails.token && fetchDetails.token.length > 0) {
    options.headers = { Authorization: `Bearer ${fetchDetails.token}` };
  }

  let resp = {};
  let json = {};

  if (fetchDetails.fileDetails) {
    options.body = fetchDetails.fileDetails;
    options.headers = {
      ...options.headers,
      'content-type': 'multipart/form-data'
    };

    const formData = new FormData();
    formData.append('file', fetchDetails.fileDetails);

    resp = await axios.post(fetchDetails.fetchURL, formData, options);

    json = resp;
  } else {
    resp = await fetch(fetchDetails.fetchURL, options);

    json = resp.json();
  }

  console.log('resp', resp);

  return json;
};

const fetchInfo = baseFetchInfo();
const postInfo = baseFetchInfo({ method: 'POST' });

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

export { createAPIurl, fetchInfo, postInfo, createFetchItemsList };

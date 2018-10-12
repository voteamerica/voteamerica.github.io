import { put, call, takeLatest } from 'redux-saga/effects';

import { driversGetHideListTypes, getDriverListTypes } from './types';
import { createAPIurl, fetchInfo } from './sagaHelpers.js';

const urlPath = '/drivers/list';

function* fetchDriversList(action) {
  try {
    const { remoteUrlBase, token = '', successProperty } = action.payload;

    const fetchURL = createAPIurl({}, remoteUrlBase, urlPath);

    const loginResult = yield call(fetchInfo, { fetchURL, token });

    if (loginResult[successProperty] !== undefined) {
      const payload = {};

      const results = JSON.parse(loginResult[successProperty]);

      payload[successProperty] = results;

      yield put({
        type: getDriverListTypes.success,
        payload
      });
    } else {
      yield put({ type: getDriverListTypes.fail, payload: loginResult });
    }
  } catch (e) {
    yield put({
      type: getDriverListTypes.error,
      payload: { message: e.message }
    });
  }
}

function* driversListSaga() {
  yield takeLatest(driversGetHideListTypes.get, fetchDriversList);
}

export default driversListSaga;

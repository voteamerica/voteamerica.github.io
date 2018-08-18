import { put, call, takeLatest } from 'redux-saga/effects';

import { GET_DRIVERS_LIST, getDriversListTypes } from './types';
import { createAPIurl, fetchInfo } from './sagaHelpers.js';

function* fetchDriversList(action) {
  try {
    const { remoteUrlBase, successProperty } = action.payload;

    const fetchURL = createAPIurl({}, remoteUrlBase, '/users/list');

    const loginResult = yield call(fetchInfo, fetchURL);

    // if (loginInfo.status === 200) {
    if (loginResult[successProperty] !== undefined) {
      yield put({
        type: getDriversListTypes.success,
        payload: loginResult[successProperty]
      });
    } else {
      yield put({ type: getDriversListTypes.fail, payload: loginResult });
    }
  } catch (e) {
    yield put({
      type: getDriversListTypes.error,
      payload: { message: e.message }
    });
  }
}

function* driversListSaga() {
  yield takeLatest(GET_DRIVERS_LIST, fetchDriversList);
}

export default driversListSaga;

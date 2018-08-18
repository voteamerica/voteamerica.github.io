import { put, call, takeLatest } from 'redux-saga/effects';

import { loginRequestTypes, LOGIN_REQUEST } from './types.js';
import { createAPIurl, fetchInfo } from './sagaHelpers.js';

function* fetchLoginRequest(action) {
  try {
    const {
      remoteUrlBase,
      username,
      password,
      successProperty
    } = action.payload;

    const fetchURL = createAPIurl(
      { username, password },
      remoteUrlBase,
      '/users/authenticate'
    );

    const loginResult = yield call(fetchInfo, fetchURL);

    // if (loginInfo.status === 200) {
    if (loginResult[successProperty] !== undefined) {
      yield put({
        type: loginRequestTypes.success,
        payload: loginResult[successProperty]
      });
    } else {
      yield put({ type: loginRequestTypes.fail, payload: loginResult });
    }
  } catch (e) {
    yield put({
      type: loginRequestTypes.error,
      payload: { message: e.message }
    });
  }
}

function* loginSaga() {
  // NOTE: any pending requests are cancelled.
  //       Support multiple requests with takeEvery()
  yield takeLatest(LOGIN_REQUEST, fetchLoginRequest);
}

export default loginSaga;

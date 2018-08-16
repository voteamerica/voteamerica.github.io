import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL, LOGIN_ERROR } from './types';
import { put, call, takeLatest, takeEvery } from 'redux-saga/effects';
import { userInfo } from 'os';

function* fetchLoginRequest(action) {
    try {
        const loginInfo = yield call(fetch, '/users/authenticate');

        yield put({ type: LOGIN_SUCCESS, payload: userInfo });
    } catch (e) {
        yield put({ type: LOGIN_ERROR, payload: { message: e.message }});
    }
}

function* loginSaga() {
    // NOTE: any pending requests are cancelled. 
    //       Support multiple requests with takeEvery()
    yield takeLatest(LOGIN_REQUEST, fetchLoginRequest);
}

export default loginSaga;

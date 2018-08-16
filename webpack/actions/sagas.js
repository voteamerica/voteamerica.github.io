import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL, LOGIN_ERROR } from './types';
import { put, call, takeLatest, takeEvery } from 'redux-saga/effects';
import { userInfo } from 'os';

function createAPIurl (params, remoteUrl, apiRoute) {
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
  
function* fetchLoginRequest(action) {
    try {
        const { remoteUrlBase, username, password } = action.payload;

        const fetchURL = createAPIurl({username, password}, remoteUrlBase, '/users/authenticate');

        const loginInfo = yield call(fetch, fetchURL);

        if (loginInfo.status === 200){
            yield put({ type: LOGIN_SUCCESS, payload: userInfo });}
        else {
            yield put({ type: LOGIN_FAIL, payload: userInfo });
        }
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

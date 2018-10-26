import { put, call, takeLatest } from 'redux-saga/effects';

import { postUploadAsyncTypes, POST_UPLOAD } from './types';
import { createAPIurl, postInfo } from './sagaHelpers.js';

const urlPath = '/bulk-upload';

function* postUpload(action) {
  try {
    const {
      remoteUrlBase,
      token = '',
      fileDetails = {},
      successProperty
    } = action.payload;

    const postURL = createAPIurl({}, remoteUrlBase, urlPath);

    const loginResult = yield call(postInfo, {
      fetchURL: postURL,
      token,
      fileDetails
    });

    if (
      loginResult[successProperty] !== undefined &&
      loginResult[successProperty].error === undefined
    ) {
      const payload = {};

      const results = loginResult[successProperty];

      payload[successProperty] = results;

      yield put({
        type: postUploadAsyncTypes.success,
        payload
      });
    } else {
      yield put({ type: postUploadAsyncTypes.fail, payload: loginResult });
    }
  } catch (e) {
    yield put({
      type: postUploadAsyncTypes.error,
      payload: { message: e.message }
    });
  }
}

function* uploadSaga() {
  yield takeLatest(POST_UPLOAD, postUpload);
}

export default uploadSaga;

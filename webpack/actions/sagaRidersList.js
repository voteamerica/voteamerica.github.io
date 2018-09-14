import { takeLatest } from 'redux-saga/effects';

import { ridersGetHideListTypes, getRidersListTypes } from './types';
import { createFetchItemsList } from './sagaHelpers';

const ridersUrlPath = '/riders/list';

function* ridersListSaga() {
  yield takeLatest(
    ridersGetHideListTypes.get,
    createFetchItemsList(getRidersListTypes, ridersUrlPath)
  );
}

export default ridersListSaga;

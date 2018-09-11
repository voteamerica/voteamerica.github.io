import { takeLatest } from 'redux-saga/effects';

import { ridersGetHideListTypes, getRidersListTypes } from './types';
import { createFetchItemsList } from './sagaHelpers';

const ridersUrlPath = '/drivers/list';

function* ridersListSaga() {
  yield takeLatest(
    ridersGetHideListTypes.get,
    createFetchItemsList(getRidersListTypes, ridersUrlPath)
  );
}

export default ridersListSaga;

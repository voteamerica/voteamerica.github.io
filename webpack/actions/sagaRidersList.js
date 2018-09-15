import { takeLatest } from 'redux-saga/effects';

import { ridersGetHideListTypes, getRiderListTypes } from './types';
import { createFetchItemsList } from './sagaHelpers';

const ridersUrlPath = '/riders/list';

function* ridersListSaga() {
  yield takeLatest(
    ridersGetHideListTypes.get,
    createFetchItemsList(getRiderListTypes, ridersUrlPath)
  );
}

export default ridersListSaga;

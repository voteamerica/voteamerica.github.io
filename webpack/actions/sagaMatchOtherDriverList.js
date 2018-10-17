import { takeLatest } from 'redux-saga/effects';

import {
  matchesOtherDriverGetHideListTypes,
  getMatchOtherDriverListTypes
} from './types';
import { createFetchItemsList } from './sagaHelpers';

const matchesOtherDriverUrlPath = '/matches-other/list';

function* matchOtherDriverListSaga() {
  yield takeLatest(
    matchesOtherDriverGetHideListTypes.get,
    createFetchItemsList(
      getMatchOtherDriverListTypes,
      matchesOtherDriverUrlPath
    )
  );
}

export default matchOtherDriverListSaga;

const NO_OP = 'NO_OP';

const LOGIN_DETAILS = 'LOGIN_DETAILS';
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGOUT = 'LOGOUT';

// const GET_DRIVERS_LIST = 'GET_DRIVERS_LIST';
// const HIDE_DRIVERS_LIST = 'HIDE_DRIVERS_LIST';

const DEFAULT_LIST_PAGE_INDEX = 0;
const DEFAULT_LIST_PAGE_SIZE = 5;

const driverType = 'DRIVER';
const riderType = 'RIDERS';
const matchType = 'MATCH';

const driverListType = 'DRIVERS';
const riderListType = 'RIDERS';
const matchListType = 'MATCHES';
const matchOtherDriverListType = 'MATCHES_OTHER_DRIVER';

const UPLOAD_FILE_CHOSEN = 'UPLOAD_FILE_CHOSEN';
const POST_UPLOAD = 'POST_UPLOAD';

const itemsGetHideListTypes = itemType => ({
  get: 'GET_' + itemType + '_LIST',
  hide: 'HIDE_' + itemType + '_LIST'
});

const driversGetHideListTypes = itemsGetHideListTypes(driverListType);
const ridersGetHideListTypes = itemsGetHideListTypes(riderListType);
const matchesGetHideListTypes = itemsGetHideListTypes(matchListType);
const matchesOtherDriverGetHideListTypes = itemsGetHideListTypes(
  matchOtherDriverListType
);

const downloadLinkShowHideTypes = itemType => ({
  show: 'SHOW_DOWNLOAD_' + itemType,
  hide: 'HIDE_DOWNLOAD_' + itemType
});

const driversListDownloadLinkShowHideTypes = downloadLinkShowHideTypes(
  driverListType
);
const ridersListDownloadLinkShowHideTypes = downloadLinkShowHideTypes(
  riderListType
);
const matchesListDownloadLinkShowHideTypes = downloadLinkShowHideTypes(
  matchListType
);
const matchesOtherDriverListDownloadLinkShowHideTypes = downloadLinkShowHideTypes(
  matchOtherDriverListType
);

const itemsListSetInfoTypes = itemType => 'SET_' + itemType + '_LIST_INFO';

const driversListSetInfoType = itemsListSetInfoTypes(driverListType);
const ridersListSetInfoType = itemsListSetInfoTypes(riderListType);
const matchesListSetInfoType = itemsListSetInfoTypes(matchListType);
const matchesOtherDriverListSetInfoType = itemsListSetInfoTypes(
  matchOtherDriverListType
);

const itemsListHideExpiredTypes = itemType => itemType + '_LIST_HIDE_EXPIRED';

const driversListHideExpiredType = itemsListHideExpiredTypes(driverListType);
const ridersListHideExpiredType = itemsListHideExpiredTypes(riderListType);
const matchesListHideExpiredType = itemsListHideExpiredTypes(matchListType);
const matchesOtherDriverListHideExpiredType = itemsListHideExpiredTypes(
  matchOtherDriverListType
);

const itemsListHideConfirmedTypes = itemType =>
  itemType + '_LIST_HIDE_CONFIRMED';

const driversListHideConfirmedType = itemsListHideConfirmedTypes(
  driverListType
);
const ridersListHideConfirmedType = itemsListHideConfirmedTypes(riderListType);
const matchesListHideConfirmedType = itemsListHideConfirmedTypes(matchListType);
const matchesOtherDriverListHideConfirmedType = itemsListHideConfirmedTypes(
  matchOtherDriverListType
);

const itemsListShowCurrentMatchOnlyTypes = itemType =>
  itemType + '_LIST_SHOW_CURRENT_MATCH_ONLY';

const driversListShowCurrentMatchOnlyType = itemsListShowCurrentMatchOnlyTypes(
  driverListType
);
const ridersListShowCurrentMatchOnlyType = itemsListShowCurrentMatchOnlyTypes(
  riderListType
);

const currentItemShowHideTypes = itemType => ({
  show: 'SHOW_CURRENT_' + itemType,
  hide: 'HIDE_CURRENT_' + itemType
});

const currentDriverShowHideTypes = currentItemShowHideTypes(driverType);
const currentRiderShowHideTypes = currentItemShowHideTypes(riderType);
const currentMatchShowHideTypes = currentItemShowHideTypes(matchType);

const getAsyncTypes = type => ({
  success: type + '_SUCCESS',
  fail: type + '_FAIL',
  error: type + '_ERROR'
});

const loginRequestTypes = getAsyncTypes(LOGIN_REQUEST);

const getDriverListTypes = getAsyncTypes(driversGetHideListTypes.get);
const getRiderListTypes = getAsyncTypes(ridersGetHideListTypes.get);
const getMatchListTypes = getAsyncTypes(matchesGetHideListTypes.get);
const getMatchOtherDriverListTypes = getAsyncTypes(
  matchesOtherDriverGetHideListTypes.get
);

const postUploadAsyncTypes = getAsyncTypes(POST_UPLOAD);

export {
  NO_OP,
  LOGIN_DETAILS,
  LOGIN_REQUEST,
  loginRequestTypes,
  LOGOUT,
  DEFAULT_LIST_PAGE_INDEX,
  DEFAULT_LIST_PAGE_SIZE,
  driversGetHideListTypes,
  driversListShowCurrentMatchOnlyType,
  driversListSetInfoType,
  getDriverListTypes,
  driversListHideExpiredType,
  driversListHideConfirmedType,
  currentDriverShowHideTypes,
  driversListDownloadLinkShowHideTypes,
  ridersGetHideListTypes,
  ridersListDownloadLinkShowHideTypes,
  ridersListSetInfoType,
  getRiderListTypes,
  ridersListHideExpiredType,
  ridersListHideConfirmedType,
  ridersListShowCurrentMatchOnlyType,
  currentRiderShowHideTypes,
  matchesGetHideListTypes,
  matchesListDownloadLinkShowHideTypes,
  matchesListSetInfoType,
  matchesListHideExpiredType,
  matchesListHideConfirmedType,
  getMatchListTypes,
  currentMatchShowHideTypes,
  matchesOtherDriverGetHideListTypes,
  matchesOtherDriverListDownloadLinkShowHideTypes,
  matchesOtherDriverListSetInfoType,
  matchesOtherDriverListHideExpiredType,
  matchesOtherDriverListHideConfirmedType,
  getMatchOtherDriverListTypes,
  UPLOAD_FILE_CHOSEN,
  POST_UPLOAD,
  postUploadAsyncTypes
};

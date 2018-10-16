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

const itemsGetHideListTypes = itemType => ({
  get: 'GET_' + itemType + '_LIST',
  hide: 'HIDE_' + itemType + '_LIST'
});

const driversGetHideListTypes = itemsGetHideListTypes(driverListType);
const ridersGetHideListTypes = itemsGetHideListTypes(riderListType);
const matchesGetHideListTypes = itemsGetHideListTypes(matchListType);

const itemsListSetInfoTypes = itemType => 'SET_' + itemType + '_LIST_INFO';

const driversListSetInfoType = itemsListSetInfoTypes(driverListType);
const ridersListSetInfoType = itemsListSetInfoTypes(riderListType);
const matchesListSetInfoType = itemsListSetInfoTypes(matchListType);

const itemsListHideExpiredTypes = itemType => itemType + '_LIST_HIDE_EXPIRED';

const driversListHideExpiredType = itemsListHideExpiredTypes(driverListType);
const ridersListHideExpiredType = itemsListHideExpiredTypes(riderListType);
const matchesListHideExpiredType = itemsListHideExpiredTypes(matchListType);

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

export {
  LOGIN_DETAILS,
  LOGIN_REQUEST,
  loginRequestTypes,
  LOGOUT,
  // GET_DRIVERS_LIST,
  // HIDE_DRIVERS_LIST,
  DEFAULT_LIST_PAGE_INDEX,
  DEFAULT_LIST_PAGE_SIZE,
  driversGetHideListTypes,
  driversListSetInfoType,
  getDriverListTypes,
  driversListHideExpiredType,
  currentDriverShowHideTypes,
  ridersGetHideListTypes,
  ridersListSetInfoType,
  getRiderListTypes,
  ridersListHideExpiredType,
  currentRiderShowHideTypes,
  matchesGetHideListTypes,
  matchesListSetInfoType,
  matchesListHideExpiredType,
  getMatchListTypes,
  currentMatchShowHideTypes
};

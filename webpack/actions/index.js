import {
  loginRequestTypes,
  LOGIN_DETAILS,
  LOGIN_REQUEST,
  LOGOUT,
  GET_DRIVERS_LIST,
  HIDE_DRIVERS_LIST,
  ridersGetHideListTypes,
  currentRiderShowHideTypes
} from './types';

const loginDetails = details => ({
  type: LOGIN_DETAILS,
  payload: details
});

const login = (remoteUrlBase, username, password) => ({
  type: LOGIN_REQUEST,
  payload: { remoteUrlBase, username, password, successProperty: 'id_token' }
});

const loginSuccess = token => ({
  type: loginRequestTypes.success,
  payload: { token }
});

const logout = () => ({
  type: LOGOUT,
  payload: {}
});

const getItemsList = itemsGetListType => (remoteUrlBase, token) => ({
  type: itemsGetListType,
  payload: { remoteUrlBase, token, successProperty: 'data' }
});

const hideItemsList = itemsHideListType => () => ({
  type: itemsHideListType,
  payload: {}
});

const getDriversList = (remoteUrlBase, token) => ({
  type: GET_DRIVERS_LIST,
  payload: { remoteUrlBase, token, successProperty: 'data' }
});

const hideDriversList = () => ({
  type: HIDE_DRIVERS_LIST,
  payload: {}
});

const getRidersList = getItemsList(ridersGetHideListTypes.get);
const hideRidersList = hideItemsList(ridersGetHideListTypes.hide);

const showCurrentItem = currentItemShowType => riderDetails => ({
  type: currentItemShowType,
  payload: { riderDetails }
});

const hideCurrentItem = currentItemHideType => () => ({
  type: currentItemHideType,
  payload: {}
});

const showCurrentRider = showCurrentItem(currentRiderShowHideTypes.show);

const hideCurrentRider = hideCurrentItem(currentRiderShowHideTypes.hide);

export {
  loginDetails,
  login,
  loginSuccess,
  logout,
  getDriversList,
  hideDriversList,
  getRidersList,
  hideRidersList,
  showCurrentRider,
  hideCurrentRider
};

import {
  loginRequestTypes,
  LOGIN_DETAILS,
  LOGIN_REQUEST,
  LOGOUT,
  GET_DRIVERS_LIST,
  HIDE_DRIVERS_LIST
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

const getDriversList = (remoteUrlBase, token) => ({
  type: GET_DRIVERS_LIST,
  payload: { remoteUrlBase, token, successProperty: 'data' }
});

const hideDriversList = () => ({
  type: HIDE_DRIVERS_LIST,
  payload: {}
});

export {
  loginDetails,
  login,
  loginSuccess,
  logout,
  getDriversList,
  hideDriversList
};

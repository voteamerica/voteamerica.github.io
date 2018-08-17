import { LOGIN_DETAILS, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT } from './types';

const loginDetails = details => ({
  type: LOGIN_DETAILS,
  payload: details
});

const login = (remoteUrlBase, username, password) => ({
  type: LOGIN_REQUEST,
  payload: { remoteUrlBase, username, password, successProperty: 'id_token' }
});

const loginSuccess = token => ({
  type: LOGIN_SUCCESS,
  payload: { token }
});

const logout = () => ({
  type: LOGOUT,
  payload: {}
});

export { loginDetails, login, loginSuccess, logout };

import { LOGIN_DETAILS, LOGIN_REQUEST, LOGIN_SUCCESS } from './types';

const loginDetails = details => ({
  type: LOGIN_DETAILS,
  payload: details
});

const login = (remoteUrlBase, username, password) => ({
  type: LOGIN_REQUEST,
  payload: { remoteUrlBase, username, password }
});

const loginSuccess = token => ({
  type: LOGIN_SUCCESS,
  payload: { token }
});

export { loginDetails, login, loginSuccess };

import { LOGIN_REQUEST, LOGIN_SUCCESS } from './types';

const login = ( remoteUrlBase, username, password) => ({
    type: LOGIN_REQUEST,
    payload: { remoteUrlBase, username, password }
});

const loginSuccess = token => ({
    type: LOGIN_SUCCESS,
    payload: { token }
});

export { login, loginSuccess };
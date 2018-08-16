import { LOGIN_REQUEST, LOGIN_SUCCESS } from './types';

const login = (username, password) => ({
    type: LOGIN_REQUEST,
    payload: { username, password }
});

const loginSuccess = token => ({
    type: LOGIN_SUCCESS,
    payload: { token }
});

export { login, loginSuccess };
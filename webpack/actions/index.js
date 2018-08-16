import {} from './types';

export const login = (username, password) => ({
    type: 'LOGIN_SUCCESS',
    payload: {token: 1}
});

export const loginSuccess = token => ({
    type: 'LOGIN_SUCCESS',
    payload: { token }
});

// export const loginSuccess = dispatch => token => {
//     console.log("login token", token);

//     return dispatch(successToken(token));
// };


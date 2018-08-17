import {
  LOGIN_DETAILS,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGIN_ERROR
} from '../actions/types.js';

const loginInfo = (
  state = { details: {}, loggedIn: false, token: '' },
  action
) => {
  switch (action.type) {
    case LOGIN_DETAILS: {
      const { payload } = action;

      const details = { ...state.details, ...payload };

      return { ...state, details };
    }
    case LOGIN_REQUEST:
    case LOGIN_FAIL:
    case LOGIN_ERROR:
      return { ...state, loggedIn: false, token: '' };
    case LOGIN_SUCCESS:
      return { ...state, loggedIn: true, token: action.payload };
    default:
      return state;
  }
};

export default loginInfo;

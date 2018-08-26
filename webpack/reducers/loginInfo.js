import {
  loginRequestTypes,
  LOGIN_DETAILS,
  LOGIN_REQUEST,
  LOGOUT,
  GET_DRIVERS_LIST
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
    case loginRequestTypes.fail:
    case loginRequestTypes.error:
    case LOGOUT:
      return { ...state, loggedIn: false, token: '' };
    case loginRequestTypes.success:
      return { ...state, loggedIn: true, token: action.payload };
    case GET_DRIVERS_LIST:
    default:
      return state;
  }
};

export default loginInfo;

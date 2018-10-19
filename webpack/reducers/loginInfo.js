import {
  loginRequestTypes,
  LOGIN_DETAILS,
  LOGIN_REQUEST,
  LOGOUT,
  getDriverListTypes,
  getRiderListTypes,
  getMatchListTypes,
  getMatchOtherDriverListTypes
} from '../actions/types.js';

const loginInfo = (
  state = { details: {}, loggedIn: false, token: '', expiredToken: false },
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
      return {
        ...state,
        loggedIn: true,
        token: action.payload,
        expiredToken: false
      };

    case getDriverListTypes.fail:
    case getRiderListTypes.fail:
    case getMatchListTypes.fail:
    case getMatchOtherDriverListTypes.fail: {
      const newState = { ...state, expiredToken: true };

      return newState;
    }

    default:
      return state;
  }
};

export default loginInfo;

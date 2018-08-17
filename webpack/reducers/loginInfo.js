import { LOGIN_DETAILS, LOGIN_SUCCESS } from '../actions/types.js';

const loginInfo = (state = { details: {} }, action) => {
  switch (action.type) {
    case LOGIN_DETAILS: {
      const { payload } = action;

      const details = { ...state.details, ...payload };

      return { ...state, details };
    }
    case LOGIN_SUCCESS:
      return { ...state, token: 1 };
    default:
      return state;
  }
};

export default loginInfo;

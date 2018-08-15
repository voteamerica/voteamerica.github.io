import { LOGIN_SUCCESS } from '../actions/types.js';

const loginInfo = (state = {}, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { token: 1 };
        default:
            return state;
    }
}

export default loginInfo;
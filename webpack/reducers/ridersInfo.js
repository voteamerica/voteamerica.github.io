import { getRidersListTypes, ridersGetHideListTypes } from '../actions/types';

const ridersInfo = (state = { showRidersList: false, riders: [] }, action) => {
  switch (action.type) {
    case getRidersListTypes.success: {
      const { data: riders } = action.payload;

      return { ...state, showRidersList: true, riders };
    }

    case ridersGetHideListTypes.hide:
      return { ...state, showRidersList: false, riders: [] };

    default:
      return state;
  }
};

export default ridersInfo;

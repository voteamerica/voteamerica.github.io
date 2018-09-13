import {
  getRidersListTypes,
  ridersGetHideListTypes,
  currentRiderShowHideTypes
} from '../actions/types';

const ridersInfo = (
  state = {
    showRidersList: false,
    riders: [],
    showCurrentRiderDetails: false,
    currentRider: {}
  },
  action
) => {
  switch (action.type) {
    case getRidersListTypes.success: {
      const { data: riders } = action.payload;

      return { ...state, showRidersList: true, riders };
    }

    case ridersGetHideListTypes.hide:
      return { ...state, showRidersList: false, riders: [] };

    case currentRiderShowHideTypes.show:
      return {
        ...state,
        showCurrentRiderDetails: true,
        currentRider: action.payload.riderDetails
      };

    case currentRiderShowHideTypes.hide:
      return { ...state, showCurrentRiderDetails: false, currentRider: {} };

    default:
      return state;
  }
};

export default ridersInfo;

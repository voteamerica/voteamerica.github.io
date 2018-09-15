import {
  getRiderListTypes,
  ridersGetHideListTypes,
  currentRiderShowHideTypes
} from '../actions/types';

const ridersInfo = (
  state = {
    showRiderList: false,
    riders: [],
    showCurrentRiderDetails: false,
    currentRider: {}
  },
  action
) => {
  switch (action.type) {
    case getRiderListTypes.success: {
      const { data: riders } = action.payload;

      return { ...state, showRiderList: true, riders };
    }

    case ridersGetHideListTypes.hide:
      return { ...state, showRiderList: false, riders: [] };

    case currentRiderShowHideTypes.show:
      return {
        ...state,
        showCurrentRiderDetails: true,
        currentRider: action.payload.itemDetails
      };

    case currentRiderShowHideTypes.hide:
      return { ...state, showCurrentRiderDetails: false, currentRider: {} };

    default:
      return state;
  }
};

export default ridersInfo;

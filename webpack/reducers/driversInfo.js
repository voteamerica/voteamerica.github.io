import {
  getDriverListTypes,
  HIDE_DRIVERS_LIST,
  currentDriverShowHideTypes
} from '../actions/types';

const driversInfo = (
  state = {
    showDriversList: false,
    drivers: [],
    showCurrentDriverDetails: false,
    currentDriver: {}
  },
  action
) => {
  switch (action.type) {
    case getDriverListTypes.success: {
      const { data: drivers } = action.payload;

      return { ...state, showDriversList: true, drivers };
    }

    case HIDE_DRIVERS_LIST:
      return { ...state, showDriversList: false, drivers: [] };

    case currentDriverShowHideTypes.show:
      return {
        ...state,
        showCurrentDriverDetails: true,
        currentDriver: action.payload.itemDetails
      };

    case currentDriverShowHideTypes.hide:
      return { ...state, showCurrentDriverDetails: false, currentDriver: {} };

    default:
      return state;
  }
};

export default driversInfo;

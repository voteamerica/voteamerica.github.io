import {
  DEFAULT_LIST_PAGE_INDEX,
  DEFAULT_LIST_PAGE_SIZE,
  getDriverListTypes,
  driversGetHideListTypes,
  currentDriverShowHideTypes
} from '../actions/types';

const driversInfo = (
  state = {
    showDriversList: false,
    drivers: [],
    listPageIndex: DEFAULT_LIST_PAGE_INDEX,
    listPageSize: DEFAULT_LIST_PAGE_SIZE,
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

    case driversGetHideListTypes.hide:
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

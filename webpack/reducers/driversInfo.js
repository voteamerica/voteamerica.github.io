import {
  DEFAULT_LIST_PAGE_INDEX,
  DEFAULT_LIST_PAGE_SIZE,
  LOGOUT,
  getDriverListTypes,
  driversGetHideListTypes,
  driversListDownloadLinkShowHideTypes,
  driversListSetInfoType,
  driversListHideExpiredType,
  driversListHideConfirmedType,
  driversListShowCurrentMatchOnlyType,
  currentDriverShowHideTypes
} from '../actions/types';

const driversInfo = (
  state = {
    showDriversList: false,
    drivers: [],
    listPageIndex: DEFAULT_LIST_PAGE_INDEX,
    listPageSize: DEFAULT_LIST_PAGE_SIZE,
    hideExpiredCanceled: false,
    hideConfirmed: false,
    showCurrentMatchDriverOnly: false,
    showCurrentDriverDetails: false,
    currentDriver: {},
    showDownloadLink: false
  },
  action
) => {
  switch (action.type) {
    case LOGOUT:
      return {
        ...state,
        showDriversList: false,
        matches: [],
        listPageIndex: DEFAULT_LIST_PAGE_INDEX,
        showCurrentDriverDetails: false,
        currentDriver: {}
      };

    case getDriverListTypes.success: {
      const { data: drivers } = action.payload;

      return { ...state, showDriversList: true, drivers };
    }

    case driversGetHideListTypes.hide:
      return { ...state, showDriversList: false, drivers: [] };

    case driversListDownloadLinkShowHideTypes.show:
    case driversListDownloadLinkShowHideTypes.hide:
      return { ...state, showDownloadLink: !state.showDownloadLink };

    case currentDriverShowHideTypes.show:
      return {
        ...state,
        showCurrentDriverDetails: true,
        currentDriver: action.payload.itemDetails
      };

    case driversListSetInfoType:
      return {
        ...state,
        listPageIndex: action.payload.listPageIndex,
        listPageSize: action.payload.listPageSize
      };

    case currentDriverShowHideTypes.hide:
      return { ...state, showCurrentDriverDetails: false, currentDriver: {} };

    case driversListHideExpiredType:
      return { ...state, hideExpiredCanceled: !state.hideExpiredCanceled };

    case driversListHideConfirmedType:
      return { ...state, hideConfirmed: !state.hideConfirmed };

    case driversListShowCurrentMatchOnlyType:
      return {
        ...state,
        showCurrentMatchDriverOnly: !state.showCurrentMatchDriverOnly
      };

    default:
      return state;
  }
};

export default driversInfo;

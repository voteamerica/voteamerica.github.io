import {
  DEFAULT_LIST_PAGE_INDEX,
  DEFAULT_LIST_PAGE_SIZE,
  LOGOUT,
  getRiderListTypes,
  ridersGetHideListTypes,
  ridersListDownloadLinkShowHideTypes,
  ridersListSetInfoType,
  ridersListHideExpiredType,
  ridersListHideConfirmedType,
  ridersListShowCurrentMatchOnlyType,
  currentRiderShowHideTypes
} from '../actions/types';

const ridersInfo = (
  state = {
    showRiderList: false,
    riders: [],
    listPageIndex: DEFAULT_LIST_PAGE_INDEX,
    listPageSize: DEFAULT_LIST_PAGE_SIZE,
    hideExpiredCanceled: false,
    hideConfirmed: false,
    showCurrentMatchRiderOnly: false,
    showCurrentRiderDetails: false,
    currentRider: {},
    showDownloadLink: false
  },
  action
) => {
  switch (action.type) {
    case LOGOUT:
      return {
        ...state,
        showRiderList: false,
        matches: [],
        listPageIndex: DEFAULT_LIST_PAGE_INDEX,
        showCurrentRiderDetails: false,
        currentRider: {}
      };

    case getRiderListTypes.success: {
      const { data: riders } = action.payload;

      return { ...state, showRiderList: true, riders };
    }

    case ridersGetHideListTypes.hide:
      return { ...state, showRiderList: false, riders: [] };

    case ridersListDownloadLinkShowHideTypes.show:
    case ridersListDownloadLinkShowHideTypes.hide:
      return { ...state, showDownloadLink: !state.showDownloadLink };

    case currentRiderShowHideTypes.show:
      return {
        ...state,
        showCurrentRiderDetails: true,
        currentRider: action.payload.itemDetails
      };

    case ridersListSetInfoType:
      return {
        ...state,
        listPageIndex: action.payload.listPageIndex,
        listPageSize: action.payload.listPageSize
      };

    case currentRiderShowHideTypes.hide:
      return { ...state, showCurrentRiderDetails: false, currentRider: {} };

    case ridersListHideExpiredType:
      return { ...state, hideExpiredCanceled: !state.hideExpiredCanceled };

    case ridersListHideConfirmedType:
      return { ...state, hideConfirmed: !state.hideConfirmed };

    case ridersListShowCurrentMatchOnlyType:
      return {
        ...state,
        showCurrentMatchRiderOnly: !state.showCurrentMatchRiderOnly
      };

    default:
      return state;
  }
};

export default ridersInfo;

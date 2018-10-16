import {
  DEFAULT_LIST_PAGE_INDEX,
  DEFAULT_LIST_PAGE_SIZE,
  getRiderListTypes,
  ridersGetHideListTypes,
  ridersListSetInfoType,
  ridersListHideExpiredType,
  ridersListHideConfirmedType,
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

    default:
      return state;
  }
};

export default ridersInfo;

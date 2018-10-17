import {
  DEFAULT_LIST_PAGE_INDEX,
  DEFAULT_LIST_PAGE_SIZE,
  getMatchOtherDriverListTypes,
  matchesOtherDriverGetHideListTypes,
  matchesListSetInfoType,
  matchesListHideExpiredType,
  matchesListHideConfirmedType,
  currentMatchShowHideTypes
} from '../actions/types';

const matchesOtherDriverInfo = (
  state = {
    showMatchList: false,
    matches: [],
    listPageIndex: DEFAULT_LIST_PAGE_INDEX,
    listPageSize: DEFAULT_LIST_PAGE_SIZE,
    hideExpiredCanceled: false,
    hideConfirmed: false,
    showCurrentMatchDetails: false,
    currentMatch: {}
  },
  action
) => {
  switch (action.type) {
    case getMatchOtherDriverListTypes.success: {
      const { data: matches } = action.payload;

      return { ...state, showMatchList: true, matches };
    }

    case matchesOtherDriverGetHideListTypes.hide:
      return { ...state, showMatchList: false, matches: [] };

    // case currentMatchShowHideTypes.show:
    //   return {
    //     ...state,
    //     showCurrentMatchDetails: true,
    //     currentMatch: action.payload.itemDetails
    //   };

    // case matchesListSetInfoType:
    //   return {
    //     ...state,
    //     listPageIndex: action.payload.listPageIndex,
    //     listPageSize: action.payload.listPageSize
    //   };

    // case currentMatchShowHideTypes.hide:
    //   return { ...state, showCurrentMatchDetails: false, currentMatch: {} };

    // case matchesListHideExpiredType:
    //   return { ...state, hideExpiredCanceled: !state.hideExpiredCanceled };

    // case matchesListHideConfirmedType:
    //   return { ...state, hideConfirmed: !state.hideConfirmed };

    default:
      return state;
  }
};

export default matchesOtherDriverInfo;

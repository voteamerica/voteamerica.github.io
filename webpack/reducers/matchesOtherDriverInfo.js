import {
  DEFAULT_LIST_PAGE_INDEX,
  DEFAULT_LIST_PAGE_SIZE,
  LOGOUT,
  getMatchOtherDriverListTypes,
  matchesOtherDriverListDownloadLinkShowHideTypes,
  matchesOtherDriverGetHideListTypes,
  matchesOtherDriverListSetInfoType,
  matchesOtherDriverListHideExpiredType,
  matchesOtherDriverListHideConfirmedType
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
    currentMatch: {},
    showDownloadLink: false,
    urlDownloadBlob: ''
  },
  action
) => {
  switch (action.type) {
    case LOGOUT:
      return {
        ...state,
        showMatchList: false,
        matches: [],
        listPageIndex: DEFAULT_LIST_PAGE_INDEX,
        showCurrentMatchDetails: false,
        currentMatch: {}
      };

    case getMatchOtherDriverListTypes.success: {
      const { data: matches } = action.payload;

      return { ...state, showMatchList: true, matches };
    }

    case matchesOtherDriverGetHideListTypes.hide:
      return { ...state, showMatchList: false, matches: [] };

    case matchesOtherDriverListDownloadLinkShowHideTypes.show: {
      const { urlDownloadBlob } = action.payload;

      return { ...state, showDownloadLink: true, urlDownloadBlob };
    }

    case matchesOtherDriverListDownloadLinkShowHideTypes.hide:
      return { ...state, showDownloadLink: false, urlDownloadBlob: '' };

    case matchesOtherDriverListSetInfoType:
      return {
        ...state,
        listPageIndex: action.payload.listPageIndex,
        listPageSize: action.payload.listPageSize
      };

    case matchesOtherDriverListHideExpiredType:
      return { ...state, hideExpiredCanceled: !state.hideExpiredCanceled };

    case matchesOtherDriverListHideConfirmedType:
      return { ...state, hideConfirmed: !state.hideConfirmed };

    default:
      return state;
  }
};

export default matchesOtherDriverInfo;

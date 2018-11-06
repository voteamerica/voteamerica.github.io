import {
  DEFAULT_LIST_PAGE_INDEX,
  DEFAULT_LIST_PAGE_SIZE,
  LOGOUT,
  getMatchListTypes,
  matchesListDownloadLinkShowHideTypes,
  matchesGetHideListTypes,
  matchesListSetInfoType,
  matchesListHideExpiredType,
  matchesListHideConfirmedType,
  currentMatchShowHideTypes,
  currentDriverShowHideTypes,
  currentRiderShowHideTypes,
  showMatchForCurrentDriverType,
  showMatchForCurrentRiderType
} from '../actions/types';

const defaultCurrentDriverOrRider = { UUID: '' };

const matchesInfo = (
  state = {
    showMatchList: false,
    matches: [],
    listPageIndex: DEFAULT_LIST_PAGE_INDEX,
    listPageSize: DEFAULT_LIST_PAGE_SIZE,
    hideExpiredCanceled: false,
    hideConfirmed: false,
    showCurrentMatchDetails: false,
    currentMatch: {},
    currentDriver: defaultCurrentDriverOrRider,
    currentRider: defaultCurrentDriverOrRider,
    showMatchForCurrentDriverOnly: false,
    showMatchForCurrentRiderOnly: false,
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
        currentMatch: {},
        currentDriver: defaultCurrentDriverOrRider,
        currentRider: defaultCurrentDriverOrRider
      };

    case getMatchListTypes.success: {
      const { data: matches } = action.payload;

      return { ...state, showMatchList: true, matches };
    }

    case matchesGetHideListTypes.hide:
      return { ...state, showMatchList: false, matches: [] };

    case matchesListDownloadLinkShowHideTypes.show: {
      const { urlDownloadBlob } = action.payload;

      return { ...state, showDownloadLink: true, urlDownloadBlob };
    }

    case matchesListDownloadLinkShowHideTypes.hide:
      return { ...state, showDownloadLink: false, urlDownloadBlob: '' };

    case currentMatchShowHideTypes.show:
      return {
        ...state,
        showCurrentMatchDetails: true,
        currentMatch: action.payload.itemDetails
      };

    case matchesListSetInfoType:
      return {
        ...state,
        listPageIndex: action.payload.listPageIndex,
        listPageSize: action.payload.listPageSize
      };

    case currentMatchShowHideTypes.hide:
      return { ...state, showCurrentMatchDetails: false, currentMatch: {} };

    case matchesListHideExpiredType:
      return { ...state, hideExpiredCanceled: !state.hideExpiredCanceled };

    case matchesListHideConfirmedType:
      return { ...state, hideConfirmed: !state.hideConfirmed };

    case showMatchForCurrentDriverType: {
      const showMatchForCurrentDriverOnly = !state.showMatchForCurrentDriverOnly;

      // both checkboxes cannot be true, so other option is either already false or should become so
      const showMatchForCurrentRiderOnly = false;

      return {
        ...state,
        showMatchForCurrentDriverOnly,
        showMatchForCurrentRiderOnly
      };
    }

    case showMatchForCurrentRiderType: {
      const showMatchForCurrentRiderOnly = !state.showMatchForCurrentRiderOnly;

      // both checkboxes cannot be true, so other option is either already false or should become so
      const showMatchForCurrentDriverOnly = false;

      return {
        ...state,
        showMatchForCurrentDriverOnly,
        showMatchForCurrentRiderOnly
      };
    }

    case currentDriverShowHideTypes.show:
      return { ...state, currentDriver: action.payload.itemDetails };

    case currentDriverShowHideTypes.hide:
      return { ...state, currentDriver: defaultCurrentDriverOrRider };

    case currentRiderShowHideTypes.show:
      return { ...state, currentRider: action.payload.itemDetails };

    case currentRiderShowHideTypes.hide:
      return { ...state, currentRider: defaultCurrentDriverOrRider };

    default:
      return state;
  }
};

export default matchesInfo;

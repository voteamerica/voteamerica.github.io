import {
  DEFAULT_LIST_PAGE_INDEX,
  DEFAULT_LIST_PAGE_SIZE,
  getMatchListTypes,
  matchesGetHideListTypes,
  matchesListSetInfoType,
  currentMatchShowHideTypes
} from '../actions/types';

const matchesInfo = (
  state = {
    showMatchList: false,
    matches: [],
    listPageIndex: DEFAULT_LIST_PAGE_INDEX,
    listPageSize: DEFAULT_LIST_PAGE_SIZE,
    showCurrentMatchDetails: false,
    currentMatch: {}
  },
  action
) => {
  switch (action.type) {
    case getMatchListTypes.success: {
      const { data: matches } = action.payload;

      return { ...state, showMatchList: true, matches };
    }

    case matchesGetHideListTypes.hide:
      return { ...state, showMatchList: false, matches: [] };

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

    default:
      return state;
  }
};

export default matchesInfo;

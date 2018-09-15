import {
  getMatchListTypes,
  matchesGetHideListTypes,
  currentMatchShowHideTypes
} from '../actions/types';

const matchesInfo = (
  state = {
    showMatchList: false,
    matches: [],
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

    case currentMatchShowHideTypes.hide:
      return { ...state, showCurrentMatchDetails: false, currentMatch: {} };

    default:
      return state;
  }
};

export default matchesInfo;

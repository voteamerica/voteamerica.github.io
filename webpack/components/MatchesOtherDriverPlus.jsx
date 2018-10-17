import { connect } from 'react-redux';

import MatchesBase from './Matches.bs.js';

import {
  getMatchesOtherDriverList,
  hideMatchesOtherDriverList,
  setInfoMatchesList,
  hideExpiredMatchesList,
  hideConfirmedMatchesList,
  showCurrentMatch,
  hideCurrentMatch
} from '../actions/index.js';

const mapStateToProps = state => {
  const { apiInfo, loginInfo, matchesOtherDriverInfo } = state;

  return { apiInfo, loginInfo, matchesInfo: matchesOtherDriverInfo };
};

const mapDispatchToProps = {
  getMatchesList: getMatchesOtherDriverList,
  hideMatchesList: hideMatchesOtherDriverList,
  setInfoMatchesList,
  hideExpiredMatchesList,
  hideConfirmedMatchesList,
  showCurrentMatch,
  hideCurrentMatch
};

const MatchesOtherPlus = connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchesBase);

export default MatchesOtherPlus;

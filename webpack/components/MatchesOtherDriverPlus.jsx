import { connect } from 'react-redux';

import MatchesBase from './Matches.bs.js';

import {
  noOp,
  getMatchesOtherDriverList,
  hideMatchesOtherDriverList,
  setInfoMatchesOtherDriverList,
  hideExpiredMatchesOtherDriverList,
  hideConfirmedMatchesOtherDriverList
} from '../actions/index.js';

const mapStateToProps = state => {
  const { apiInfo, loginInfo, matchesOtherDriverInfo } = state;

  return { apiInfo, loginInfo, matchesInfo: matchesOtherDriverInfo };
};

const mapDispatchToProps = {
  getMatchesList: getMatchesOtherDriverList,
  hideMatchesList: hideMatchesOtherDriverList,
  setInfoMatchesList: setInfoMatchesOtherDriverList,
  hideExpiredMatchesList: hideExpiredMatchesOtherDriverList,
  hideConfirmedMatchesList: hideConfirmedMatchesOtherDriverList,
  showCurrentMatch: noOp,
  hideCurrentMatch: noOp
};

const MatchesOtherPlus = connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchesBase);

export default MatchesOtherPlus;

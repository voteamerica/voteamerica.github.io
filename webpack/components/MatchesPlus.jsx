import { connect } from 'react-redux';

import MatchesBase from './Matches.bs.js';

import {
  getMatchesList,
  hideMatchesList,
  showCurrentMatch,
  hideCurrentMatch
} from '../actions/index.js';

const mapStateToProps = state => {
  const { apiInfo, loginInfo, matchesInfo } = state;

  return { apiInfo, loginInfo, matchesInfo };
};

const mapDispatchToProps = {
  getMatchesList,
  hideMatchesList,
  showCurrentMatch,
  hideCurrentMatch
};

const MatchesPlus = connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchesBase);

export default MatchesPlus;

import { connect } from 'react-redux';

import MatchesBase from './Matches.bs.js';

import {
  getMatchesList,
  hideMatchesList,
  showMatchesListDownloadLink,
  hideMatchesListDownloadLink,
  setInfoMatchesList,
  hideExpiredMatchesList,
  hideConfirmedMatchesList,
  showCurrentMatch,
  hideCurrentMatch,
  showMatchForCurrentDriver,
  showMatchForCurrentRider
} from '../actions/index.js';

const mapStateToProps = state => {
  const { apiInfo, loginInfo, matchesInfo } = state;

  return { apiInfo, loginInfo, matchesInfo };
};

const mapDispatchToProps = {
  getMatchesList,
  hideMatchesList,
  showMatchesListDownloadLink,
  hideMatchesListDownloadLink,
  setInfoMatchesList,
  hideExpiredMatchesList,
  hideConfirmedMatchesList,
  showCurrentMatch,
  hideCurrentMatch,
  showMatchForCurrentDriver,
  showMatchForCurrentRider
};

const MatchesPlus = connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchesBase);

export default MatchesPlus;

import { connect } from 'react-redux';

import MatchesBase from './Matches.bs.js';

import {
  getRidersList,
  hideRidersList,
  showCurrentRider,
  hideCurrentRider
} from '../actions/index.js';

const mapStateToProps = state => {
  const { apiInfo, loginInfo, ridersInfo } = state;

  const matches = ridersInfo.riders;
  const matchesInfo = { ...ridersInfo, matches };

  return { apiInfo, loginInfo, matchesInfo };
};

const mapDispatchToProps = {
  getRidersList,
  hideRidersList,
  showCurrentRider,
  hideCurrentRider
};

const MatchesPlus = connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchesBase);

export default MatchesPlus;

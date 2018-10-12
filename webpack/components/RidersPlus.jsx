import { connect } from 'react-redux';

import RidersBase from './Riders.bs.js';

import {
  getRidersList,
  hideRidersList,
  setInfoRidersList,
  showCurrentRider,
  hideCurrentRider
} from '../actions/index.js';

const mapStateToProps = state => {
  const { apiInfo, loginInfo, ridersInfo, matchesInfo } = state;

  return { apiInfo, loginInfo, ridersInfo, matchesInfo };
};

const mapDispatchToProps = {
  getRidersList,
  hideRidersList,
  setInfoRidersList,
  showCurrentRider,
  hideCurrentRider
};

const RidersPlus = connect(
  mapStateToProps,
  mapDispatchToProps
)(RidersBase);

export default RidersPlus;

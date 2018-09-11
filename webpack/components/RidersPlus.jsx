import { connect } from 'react-redux';

import Riders from './Riders.bs.js';

import { getRidersList, hideRidersList } from '../actions/index.js';

const mapStateToProps = state => {
  const { apiInfo, loginInfo, ridersInfo } = state;

  return { apiInfo, loginInfo, ridersInfo };
};

const mapDispatchToProps = { getRidersList, hideRidersList };

const RidersPlus = connect(
  mapStateToProps,
  mapDispatchToProps
)(Riders);

export default RidersPlus;

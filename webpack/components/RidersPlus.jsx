import { connect } from 'react-redux';

import Riders from './Riders.bs.js';

const mapStateToProps = state => {
  // const { apiInfo, loginInfo, driversInfo } = state;
  const { driversInfo } = state;
  // const riders = 'testr';
  const riders = driversInfo.drivers;

  return { riders };
};

const mapDispatchToProps = {};

const RidersPlus = connect(
  mapStateToProps,
  mapDispatchToProps
)(Riders);

export default RidersPlus;

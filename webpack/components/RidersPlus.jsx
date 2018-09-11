import { connect } from 'react-redux';

import Riders from './Riders.bs.js';

import { getRidersList, hideRidersList } from '../actions/index.js';

const mapStateToProps = state => {
  const { apiInfo, loginInfo, ridersInfo } = state;

  // const riders = ridersInfo.drivers;
  // const showRidersList = driversInfo.showDriversList;
  // const riders = [
  //   { DriverFirstName: 't1', DriverEmail: 'x@test.com', DriverLastName: 'l1' },
  //   { DriverFirstName: 't2', DriverEmail: 'y@test.com', DriverLastName: 'l2' }
  // ];

  // const ridersInfo = { ...driversInfo, showRidersList, riders };

  return { apiInfo, loginInfo, ridersInfo };
};

const mapDispatchToProps = { getRidersList, hideRidersList };

const RidersPlus = connect(
  mapStateToProps,
  mapDispatchToProps
)(Riders);

export default RidersPlus;

import { connect } from 'react-redux';

import Riders from './Riders.bs.js';

const mapStateToProps = state => {
  // const { apiInfo, loginInfo, driversInfo } = state;
  const { loginInfo, driversInfo } = state;

  const riders = driversInfo.drivers;
  const showRidersList = driversInfo.showDriversList;
  // const riders = [
  //   { DriverFirstName: 't1', DriverEmail: 'x@test.com', DriverLastName: 'l1' },
  //   { DriverFirstName: 't2', DriverEmail: 'y@test.com', DriverLastName: 'l2' }
  // ];

  const ridersInfo = { ...driversInfo, showRidersList, riders };

  return { loginInfo, ridersInfo };
};

const mapDispatchToProps = {};

const RidersPlus = connect(
  mapStateToProps,
  mapDispatchToProps
)(Riders);

export default RidersPlus;

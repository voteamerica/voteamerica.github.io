import { connect } from 'react-redux';

import Riders from './Riders.bs.js';

const mapStateToProps = state => {
  // const { apiInfo, loginInfo, driversInfo } = state;
  const { driversInfo } = state;
  // const riders = 'testr';
  // const riders = driversInfo.drivers;
  const riders = [
    { DriverFirstName: 't1', DriverEmail: 'x@test.com', DriverLastName: 'l1' },
    { DriverFirstName: 't2', DriverEmail: 'y@test.com', DriverLastName: 'l2' }
  ];

  return { riders };
};

const mapDispatchToProps = {};

const RidersPlus = connect(
  mapStateToProps,
  mapDispatchToProps
)(Riders);

export default RidersPlus;

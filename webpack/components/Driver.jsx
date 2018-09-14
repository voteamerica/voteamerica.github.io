import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';

import 'react-table/react-table.css';

import { getDriversList, hideDriversList } from '../actions/index.js';

const mapStateToProps = state => {
  const { apiInfo, loginInfo, driversInfo } = state;

  return { apiInfo, loginInfo, driversInfo };
};

const mapDispatchToProps = { getDriversList, hideDriversList };

class DriverBase extends Component {
  handleGetDriversListClick(self) {
    return () => {
      const { apiInfo, getDriversList, loginInfo } = self.props;
      const token = loginInfo.token || '';

      return getDriversList(apiInfo.apiUrl, token);
    };
  }

  handleHideDriversListClick(self) {
    return () => {
      const { hideDriversList } = self.props;

      return hideDriversList();
    };
  }

  render() {
    const { loginInfo, driversInfo } = this.props;

    const showDriver = driver => {
      return <li key={driver.UUID}>{driver.username}</li>;
    };

    const driversList = (
      <ul>
        {driversInfo.drivers
          ? driversInfo.drivers.map(driver => showDriver(driver))
          : false}
      </ul>
    );

    const driverColumns = [
      { Header: 'First Name', accessor: 'DriverFirstName' },
      { Header: 'Email', accessor: 'DriverEmail' },
      { Header: 'Last Name', accessor: 'DriverLastName' },
      { Header: 'Powerchair', accessor: 'DriverCanLoadRiderWithWheelchair' },
      { Header: 'Zip', accessor: 'DriverCollectionZIP' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Seats', accessor: 'SeatCount' },
      { Header: 'License', accessor: 'DriverLicenseNumber' },
      { Header: 'Phone', accessor: 'DriverPhone' },
      { Header: 'Collection ZIP', accessor: 'DriverCollectionZIP' },
      { Header: 'Radius', accessor: 'DriverCollectionRadius' },
      { Header: 'Drive Times', accessor: 'AvailableDriveTimesLocal' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Created', accessor: 'created_ts' },
      { Header: 'Updated', accessor: 'last_updated_ts' },
      { Header: 'Org', accessor: 'uuid_organization' }
    ];

    const driverTableDivStyle = {
      marginTop: 20,
      marginBottom: 10
    };

    return (
      <div>
        {loginInfo.loggedIn === true ? (
          <div>
            <h2 className="operator-page-heading">Driver Info</h2>
            <div>
              {driversInfo.showDriversList === false ? (
                <button
                  className="button button--large"
                  id="showGetDriversList"
                  onClick={this.handleGetDriversListClick(this)}
                >
                  Show Drivers List
                </button>
              ) : (
                <div>
                  <button
                    className="button button--large"
                    id="hideGetDriversList"
                    onClick={this.handleHideDriversListClick(this)}
                  >
                    Hide List
                  </button>
                  {driversInfo.drivers ? (
                    <div style={driverTableDivStyle}>
                      <ReactTable
                        defaultPageSize={5}
                        data={driversInfo.drivers}
                        columns={driverColumns}
                      />
                    </div>
                  ) : (
                    false
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          false
        )}
      </div>
    );
  }
}

// { driversList }
//                     <li>{driver.username}</li>

const Driver = connect(
  mapStateToProps,
  mapDispatchToProps
)(DriverBase);

export default Driver;

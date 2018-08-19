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
      { Header: 'Username', accessor: 'username' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Admin', accessor: 'admin' }
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
                  id="driverGetUsersList"
                  onClick={this.handleGetDriversListClick(this)}
                >
                  Show Drivers List
                </button>
              ) : (
                <div>
                  <button
                    className="button button--large"
                    id="driverGetUsersList"
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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';

import 'react-table/react-table.css';

import {
  getDriversList,
  hideDriversList,
  showCurrentDriver,
  hideCurrentDriver
} from '../actions/index.js';
import { currentDriverShowHideTypes } from '../actions/types.js';

const mapStateToProps = state => {
  const { apiInfo, loginInfo, driversInfo } = state;

  return { apiInfo, loginInfo, driversInfo };
};

const mapDispatchToProps = {
  getDriversList,
  hideDriversList,
  showCurrentDriver,
  hideCurrentDriver
};

class DriverBase extends Component {
  getTdPropsHandler(self) {
    return (state, rowInfo, column, instance) => {
      const tableClickHandler = (e, handleOriginal) => {
        const { showCurrentDriver, hideCurrentDriver } = self.props;

        console.log('driver click');

        if (rowInfo !== undefined) {
          const firstName = rowInfo.original.DriverFirstName;
          const lastName = rowInfo.original.DriverLastName;

          showCurrentDriver({
            DriverFirstName: firstName,
            DriverLastName: lastName
          });
        } else {
          hideCurrentDriver({});
        }

        if (handleOriginal) {
          handleOriginal();
        }
      };

      const handlerWrapper = {
        onClick: tableClickHandler
      };

      return handlerWrapper;
    };
  }

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

    const driverColumns = [
      { Header: 'UUID', accessor: 'UUID' },
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
      { Header: 'Status Info', accessor: 'status_info' },
      { Header: 'Created', accessor: 'created_ts' },
      { Header: 'Updated', accessor: 'last_updated_ts' },
      { Header: 'Org', accessor: 'uuid_organization' },
      { Header: 'OrgOBO', accessor: 'DrivingOBOOrganizationName' },
      { Header: 'Details Visible', accessor: 'RidersCanSeeDriverDetails' },
      { Header: 'No Politics', accessor: 'DriverWillNotTalkPolitics' },
      { Header: 'Ready To Match', accessor: 'ReadyToMatch' },
      { Header: 'Stay In Touch', accessor: 'PleaseStayInTouch' },
      { Header: 'Contact Method', accessor: 'DriverPreferredContact' },
      { Header: 'Will Take Care', accessor: 'DriverWillTakeCare' }
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
                    <div>
                      <div style={driverTableDivStyle}>
                        <ReactTable
                          defaultPageSize={5}
                          data={driversInfo.drivers}
                          columns={driverColumns}
                          getTdProps={this.getTdPropsHandler(this)}
                        />
                      </div>
                      {driversInfo.showCurrentDriverDetails ? (
                        <div>
                          <h3>Current Driver Info</h3>
                          <div>
                            {driversInfo.currentDriver.DriverFirstName +
                              ' ' +
                              driversInfo.currentDriver.DriverLastName}
                          </div>
                        </div>
                      ) : (
                        <div>No driver selected</div>
                      )}
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

const Driver = connect(
  mapStateToProps,
  mapDispatchToProps
)(DriverBase);

export default Driver;

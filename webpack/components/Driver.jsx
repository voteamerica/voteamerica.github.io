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

const mapStateToProps = state => {
  const { apiInfo, loginInfo, driversInfo, matchesInfo } = state;

  return { apiInfo, loginInfo, driversInfo, matchesInfo };
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
      const { driversInfo, matchesInfo } = this.props;
      const itemUuid = rowInfo !== undefined ? rowInfo.original.UUID : '';

      const tableClickHandler = (e, handleOriginal) => {
        const { showCurrentDriver, hideCurrentDriver } = self.props;

        console.log('driver click');

        if (rowInfo !== undefined) {
          const UUID = rowInfo.original.UUID;
          const firstName = rowInfo.original.DriverFirstName;
          const lastName = rowInfo.original.DriverLastName;
          const phone = rowInfo.original.DriverPhone;

          showCurrentDriver({
            UUID,
            DriverFirstName: firstName,
            DriverLastName: lastName,
            DriverPhone: phone
          });
        } else {
          hideCurrentDriver({});
        }

        if (handleOriginal) {
          handleOriginal();
        }
      };

      const getRowBkgColour = () => {
        let col = 'none';

        if (itemUuid == matchesInfo.currentMatch.uuid_driver) {
          col = 'violet';
        } else if (itemUuid == driversInfo.currentDriver.UUID) {
          col = 'green';
        }

        return col;
      };

      const getRowTextColour = () => {
        const col =
          itemUuid == driversInfo.currentDriver.UUID ? 'white' : 'black';

        return col;
      };

      const handlerWrapper = {
        onClick: tableClickHandler,
        style: {
          background: getRowBkgColour(),
          color: getRowTextColour()
        }
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
      { Header: 'Status', accessor: 'status' },
      { Header: 'Seats', accessor: 'SeatCount' },
      { Header: 'License', accessor: 'DriverLicenseNumber' },
      { Header: 'Phone', accessor: 'DriverPhone' },
      { Header: 'Collection ZIP', accessor: 'DriverCollectionZIP' },
      { Header: 'City', accessor: 'city' },
      { Header: 'State', accessor: 'full_state' },
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

    const currentDriverInfo = showCurrentDriverDetails => {
      if (!showCurrentDriverDetails) {
        return <div>No driver selected</div>;
      }

      const currentDriver = driversInfo.currentDriver;
      const uriPhone = encodeURI(currentDriver.DriverPhone);
      const selfServiceUrl =
        '../self-service/?type=driver&uuid=' +
        currentDriver.UUID +
        '&code=0&info&phone=' +
        uriPhone;

      return (
        <div>
          <h3>Current Driver Info</h3>
          <div>
            {currentDriver.DriverFirstName + ' ' + currentDriver.DriverLastName}
          </div>
          <div>
            <a href={selfServiceUrl}>Self Service Page</a>
          </div>
        </div>
      );
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
                      {currentDriverInfo(driversInfo.showCurrentDriverDetails)}
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

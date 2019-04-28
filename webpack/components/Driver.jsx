import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';

import 'react-table/react-table.css';

import LeftPaddedButton from './ui/LeftPaddedButton.jsx';

import { DEFAULT_LIST_PAGE_SIZE } from '../actions/types.js';

import {
  getDriversList,
  hideDriversList,
  showDriversListDownloadLink,
  hideDriversListDownloadLink,
  setInfoDriversList,
  hideExpiredDriversList,
  hideConfirmedDriversList,
  showCurrentMatchOnlyDriversList,
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
  showDriversListDownloadLink,
  hideDriversListDownloadLink,
  setInfoDriversList,
  hideExpiredDriversList,
  hideConfirmedDriversList,
  showCurrentMatchOnlyDriversList,
  showCurrentDriver,
  hideCurrentDriver
};

class DriverBase extends Component {
  driversTableOnPageChangeHandler(self) {
    return pageIndex => {
      const { driversInfo, setInfoDriversList } = self.props;

      const { listPageSize } = driversInfo;

      return setInfoDriversList(pageIndex, listPageSize);
    };
  }

  driversTableOnPageChangeSizeHandler(self) {
    return (size, pageIndex) => {
      const { setInfoDriversList } = self.props;

      return setInfoDriversList(pageIndex, size);
    };
  }

  getTdPropsHandler(self) {
    return (state, rowInfo, column, instance) => {
      const { driversInfo, matchesInfo } = this.props;
      const itemUuid = rowInfo !== undefined ? rowInfo.original.UUID : '';

      const tableClickHandler = (e, handleOriginal) => {
        const { showCurrentDriver, hideCurrentDriver } = self.props;

        // console.log('driver click');

        if (rowInfo !== undefined) {
          showCurrentDriver(rowInfo.original);
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

  driversTableHideExpiredHandler(self) {
    return () => {
      const { hideExpiredDriversList } = self.props;

      hideExpiredDriversList();
    };
  }

  driversTableHideConfirmedHandler(self) {
    return () => {
      const { hideConfirmedDriversList } = self.props;

      hideConfirmedDriversList();
    };
  }

  driversTableShowCurrentMatchDriverOnlyHandler(self) {
    return () => {
      const { showCurrentMatchOnlyDriversList } = self.props;

      showCurrentMatchOnlyDriversList();
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

  handleShowDriversListDownloadLinkClick(self) {
    return () => {
      const { showDriversListDownloadLink, driversInfo } = self.props;

      const tableDriversAll = driversInfo.drivers;

      const jsondr = JSON.stringify(tableDriversAll);
      const blob = new Blob([jsondr], { type: 'application/json' });
      const urlBlob = URL.createObjectURL(blob);

      return showDriversListDownloadLink(urlBlob);
    };
  }

  handleHideDriversListDownloadLinkClick(self) {
    return () => {
      const { hideDriversListDownloadLink } = self.props;

      return hideDriversListDownloadLink();
    };
  }

  render() {
    const { loginInfo, driversInfo, matchesInfo } = this.props;

    const cellBoolToString = row => String(row.value);

    const driverColumns = [
      { Header: 'UUID', accessor: 'UUID' },
      { Header: 'First Name', accessor: 'DriverFirstName' },
      { Header: 'Last Name', accessor: 'DriverLastName' },
      { Header: 'Email', accessor: 'DriverEmail' },
      {
        Header: 'Powerchair',
        accessor: 'DriverCanLoadRiderWithWheelchair',
        Cell: cellBoolToString
      },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Seats', accessor: 'SeatCount' },
      { Header: 'Matches', accessor: 'MatchCount' },
      { Header: 'Riders', accessor: 'TotalRiders' },
      {
        Header: 'Overflow',
        accessor: 'Overflow',
        Cell: ({ value }) => String(value)
      },
      { Header: 'Available Seats', accessor: 'SeatsAvailable' },
      { Header: 'Trips', accessor: 'minimumTripCount' },
      { Header: 'License', accessor: 'DriverLicenseNumber' },
      { Header: 'Phone', accessor: 'DriverPhone' },
      { Header: 'Collection ZIP', accessor: 'DriverCollectionZIP' },
      { Header: 'City', accessor: 'city' },
      { Header: 'State', accessor: 'full_state' },
      { Header: 'StateShort', accessor: 'state' },
      { Header: 'Radius', accessor: 'DriverCollectionRadius' },
      {
        Header: 'Drive Times',
        accessor: 'AvailableDriveTimesLocal',
        width: 160
      },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Status Info', accessor: 'status_info' },
      { Header: 'Created', accessor: 'created_ts', width: 160 },
      { Header: 'Updated', accessor: 'last_updated_ts', width: 160 },
      { Header: 'Org', accessor: 'uuid_organization' },
      { Header: 'OrgOBO', accessor: 'DrivingOBOOrganizationName' },
      {
        Header: 'Details Visible',
        accessor: 'RidersCanSeeDriverDetails',
        Cell: ({ value }) => String(value)
      },
      {
        Header: 'No Politics',
        accessor: 'DriverWillNotTalkPolitics',
        Cell: ({ value }) => String(value)
      },
      {
        Header: 'Ready To Match',
        accessor: 'ReadyToMatch',
        Cell: ({ value }) => String(value)
      },
      {
        Header: 'Stay In Touch',
        accessor: 'PleaseStayInTouch',
        Cell: ({ value }) => String(value)
      },
      { Header: 'Contact Method', accessor: 'DriverPreferredContact' },
      {
        Header: 'Will Take Care',
        accessor: 'DriverWillTakeCare',
        Cell: ({ value }) => String(value)
      }
    ];

    const driverTableDivStyle = {
      marginTop: 20,
      marginBottom: 10
    };

    const currentDriverItemDivStyle = {
      marginBottom: 10
    };

    const currentDriverItemSpanStyle = {
      marginLeft: 10
    };

    const currentDriverLinkStyle = { marginLeft: 10 };

    const checkboxAreaStyle = { marginTop: '20px', display: 'inline-block' };

    const checkboxLabelStyle = { paddingRight: '40px' };

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
          <div style={currentDriverItemDivStyle}>
            <span style={currentDriverItemSpanStyle}>
              {currentDriver.DriverFirstName +
                ' ' +
                currentDriver.DriverLastName}
            </span>
            <span style={currentDriverItemSpanStyle}>
              {currentDriver.DriverEmail}
            </span>
            {currentDriver.Overflow === true ? (
              <span style={currentDriverItemSpanStyle}>
                Multiple trips: <strong style={{ color: 'red' }}>Yes</strong>
              </span>
            ) : (
              false
            )}
            {currentDriver.MatchCount > 0 ? (
              <span style={currentDriverItemSpanStyle}>
                Matches: <strong>{currentDriver.MatchCount}</strong>
              </span>
            ) : (
              false
            )}
            {currentDriver.DriverCanLoadRiderWithWheelchair === true ? (
              <span style={currentDriverItemSpanStyle}>Powerchair support</span>
            ) : (
              false
            )}
          </div>
          <div style={currentDriverLinkStyle}>
            <a href={selfServiceUrl}>Self Service Page</a>
          </div>
        </div>
      );
    };

    const tableDriversAll = driversInfo.drivers;

    const filterExpiredDrivers = drivers => {
      if (driversInfo.hideExpiredCanceled === true) {
        const filterDrivers = driver =>
          driver.status !== 'Expired' && driver.status !== 'Canceled';

        const driversNotExpired = drivers.filter(filterDrivers);

        return driversNotExpired;
      } else {
        return drivers;
      }
    };

    let filterConfirmedDrivers = drivers => {
      if (driversInfo.hideConfirmed === true) {
        let filterDrivers = driver => driver.status !== 'MatchConfirmed';

        let driversNotConfirmed = drivers.filter(filterDrivers);

        return driversNotConfirmed;
      } else {
        return drivers;
      }
    };

    const tableDriversStepOne = filterExpiredDrivers(tableDriversAll);
    const tableDriversStepTwo = filterConfirmedDrivers(tableDriversStepOne);

    let filterCurrentMatchDriverOnly = drivers => {
      if (driversInfo.showCurrentMatchDriverOnly === true) {
        let filterDrivers = driver =>
          driver.UUID == matchesInfo.currentMatch.uuid_driver;

        let driversCurrentMatchOnly = drivers.filter(filterDrivers);

        return driversCurrentMatchOnly;
      } else {
        return drivers;
      }
    };

    const tableDrivers = filterCurrentMatchDriverOnly(tableDriversStepTwo);

    const downloadLinkButtonSpanStyle = { marginLeft: 130 };

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
                  <div>
                    <button
                      className="button button--large"
                      id="hideDriversListButton"
                      onClick={this.handleHideDriversListClick(this)}
                    >
                      Hide List
                    </button>
                    <LeftPaddedButton
                      className="button button--large"
                      id="refreshDriversList"
                      onClick={this.handleGetDriversListClick(this)}
                    >
                      Refresh List
                    </LeftPaddedButton>
                    {driversInfo.showDownloadLink === true ? (
                      <span style={downloadLinkButtonSpanStyle}>
                        <LeftPaddedButton
                          props={LeftPaddedButton.leftPaddedButtonProps}
                          className="button button--large"
                          id="hideDriversListDownloadLinkButton"
                          onClick={this.handleHideDriversListDownloadLinkClick(
                            this
                          )}
                        >
                          Hide Download Link
                        </LeftPaddedButton>
                        <a
                          style={{ marginLeft: 15 }}
                          className="button button--large"
                          download={
                            loginInfo.details.username +
                            ' - drivers - backup.json'
                          }
                          href={driversInfo.urlDownloadBlob}
                        >
                          Download backup
                        </a>
                      </span>
                    ) : (
                      <span style={downloadLinkButtonSpanStyle}>
                        <LeftPaddedButton
                          props={LeftPaddedButton.leftPaddedButtonProps}
                          className="button button--large"
                          id="showDriversListDownloadLinkButton"
                          onClick={this.handleShowDriversListDownloadLinkClick(
                            this
                          )}
                        >
                          Show Download Link
                        </LeftPaddedButton>
                      </span>
                    )}
                  </div>
                  {tableDrivers ? (
                    <div>
                      <div>
                        <div
                          className="form-group checkbox"
                          style={checkboxAreaStyle}
                        >
                          <label
                            className=""
                            style={checkboxLabelStyle}
                            htmlFor="hideExpired"
                          >
                            Hide Expired/Cancelled
                          </label>
                          <input
                            className=""
                            type="checkbox"
                            id="hideExpired"
                            checked={driversInfo.hideExpiredCanceled}
                            onChange={this.driversTableHideExpiredHandler(this)}
                          />
                        </div>
                        <div
                          className="form-group checkbox"
                          style={checkboxAreaStyle}
                        >
                          <label
                            className=""
                            style={checkboxLabelStyle}
                            htmlFor="hideConfirmed"
                          >
                            Hide Confirmed
                          </label>
                          <input
                            className=""
                            type="checkbox"
                            id="hideConfirmed"
                            checked={driversInfo.hideConfirmed}
                            onChange={this.driversTableHideConfirmedHandler(
                              this
                            )}
                          />
                        </div>
                        <div
                          className="form-group checkbox"
                          style={checkboxAreaStyle}
                        >
                          <label
                            className=""
                            style={checkboxLabelStyle}
                            htmlFor="showCurrentMatchDriverOnly"
                          >
                            Show Current Match Driver Only
                          </label>
                          <input
                            className=""
                            type="checkbox"
                            id="showCurrentMatchDriverOnly"
                            checked={driversInfo.showCurrentMatchDriverOnly}
                            onChange={this.driversTableShowCurrentMatchDriverOnlyHandler(
                              this
                            )}
                          />
                        </div>
                      </div>

                      <div style={driverTableDivStyle}>
                        <ReactTable
                          defaultPageSize={DEFAULT_LIST_PAGE_SIZE}
                          pageSize={driversInfo.listPageSize}
                          filterable={true}
                          data={tableDrivers}
                          columns={driverColumns}
                          onPageChange={this.driversTableOnPageChangeHandler(
                            this
                          )}
                          onPageSizeChange={this.driversTableOnPageChangeSizeHandler(
                            this
                          )}
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

// page={driversInfo.listPageIndex}

const Driver = connect(
  mapStateToProps,
  mapDispatchToProps
)(DriverBase);

export default Driver;

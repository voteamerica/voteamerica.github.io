import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getDriversList } from '../actions/index.js';

const mapStateToProps = state => {
  const { apiInfo, loginInfo } = state;

  return { apiInfo, loginInfo };
};

const mapDispatchToProps = { getDriversList };

class DriverBase extends Component {
  handleGetDriversListClick(self) {
    return () => {
      const { apiInfo, getDriversList } = self.props;

      return getDriversList(apiInfo.apiUrl);
    };
  }

  render() {
    return (
      <div>
        <div>Driver Info xx</div>
        <div>
          <a href="{{ api }}/users/list">users list</a>

          <button
            className="button button--large"
            id="driverGetUsersList"
            onClick={this.handleGetDriversListClick(this)}
          >
            Driver - Get Users List
          </button>
        </div>
      </div>
    );
  }
}

const Driver = connect(
  mapStateToProps,
  mapDispatchToProps
)(DriverBase);

export default Driver;

import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  loginDetails,
  login,
  loginSuccess,
  logout,
  getDriversList,
  getRidersList,
  getMatchesList,
  getMatchesOtherDriverList
} from '../actions/index.js';

const mapStateToProps = state => {
  const { apiInfo, loginInfo } = state;

  return { apiInfo, loginInfo };
};

const mapDispatchToProps = {
  loginDetails,
  login,
  loginSuccess,
  logout,
  getDriversList,
  getRidersList,
  getMatchesList,
  getMatchesOtherDriverList
};

class LoginAreaBase extends Component {
  handleLoginRequestClick(self) {
    return () => {
      const { apiInfo, loginInfo, login } = self.props;

      return login(
        apiInfo.apiUrl,
        loginInfo.details.username,
        loginInfo.details.password
      );
    };
  }

  handleLogoutClick(self) {
    return () => {
      const { logout } = self.props;

      return logout();
    };
  }

  handleLoginSuccessClick(self) {
    return event => {
      const { loginSuccess } = self.props;

      const token = event.target.value;

      return loginSuccess(token);
    };
  }

  handleUsernameChange(self) {
    return event => {
      const { loginDetails } = self.props;
      const username = event.target.value;

      return loginDetails({ username });
    };
  }

  handlePasswordChange(self) {
    return event => {
      const { loginDetails } = self.props;
      const password = event.target.value;

      return loginDetails({ password });
    };
  }

  handlePopulatePage(self) {
    return () => {
      const {
        apiInfo,
        loginInfo,
        getDriversList,
        getRidersList,
        getMatchesList,
        getMatchesOtherDriverList
      } = self.props;

      getDriversList(apiInfo.apiUrl, loginInfo.token);
      getRidersList(apiInfo.apiUrl, loginInfo.token);
      getMatchesList(apiInfo.apiUrl, loginInfo.token);

      return getMatchesOtherDriverList(apiInfo.apiUrl, loginInfo.token);
    };
  }

  render() {
    const { loginInfo } = this.props;
    const username = loginInfo.details.username || '';
    const password = loginInfo.details.password || '';

    console.log('logged in', loginInfo.loggedIn === true);

    const loginButtons = (
      <div>
        <div id="enter-uuid" className="form-group">
          <label htmlFor="username">Please enter your username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-input form-input--medium"
            placeholder="e.g. 1a2b-3c4d-5e6f-7g8hi9j0klmno"
            required
            onChange={this.handleUsernameChange(this)}
            value={username}
          />
          <div className="help-block with-errors" />
        </div>
        <div id="enter-phone" className="form-group">
          <label htmlFor="password">Enter your password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input form-input--medium"
            placeholder="e.g. 1234567890"
            required
            onChange={this.handlePasswordChange(this)}
            value={password}
          />
          <div className="help-block with-errors" />
        </div>
        <div>
          <button id="login" onClick={this.handleLoginRequestClick(this)}>
            Login
          </button>
        </div>
      </div>
    );

    const welcomeDivStyle = {
      paddingTop: 20,
      paddingBottom: 20
    };

    const logoutDivStyle = {
      paddingBottom: 20
    };

    const loginStatusAndLogoutButton = (
      <div>
        <div id="welcomeMessage" style={welcomeDivStyle}>
          Welcome, {loginInfo.details.username}!
        </div>
        <div style={logoutDivStyle}>
          <button id="logout" onClick={this.handleLogoutClick(this)}>
            Logout
          </button>
          <button
            id="refreshSession"
            style={{ marginLeft: 135 }}
            onClick={this.handleLoginRequestClick(this)}
          >
            Refresh Session
          </button>
          <button
            id="refreshPage"
            style={{ marginLeft: 135 }}
            onClick={this.handlePopulatePage(this)}
          >
            Populate Page
          </button>
        </div>
      </div>
    );

    const loginArea =
      loginInfo.loggedIn === false ? loginButtons : loginStatusAndLogoutButton;

    return <div id="loginArea">{loginArea}</div>;
  }
}

const LoginArea = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginAreaBase);

export default LoginArea;

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Driver from './Driver.jsx';

import { login, loginSuccess } from '../actions/index.js';

const mapStateToProps = state => {
  const { apiInfo, loginInfo } = state;

  return { apiInfo, loginInfo };
};

// const mapDispatchToProps = dispatch => {
//     return {
//         handleLoginSuccess: loginSuccess(dispatch)
//     };
// }

const mapDispatchToProps = {
  login,
  loginSuccess
};

class AppBase extends Component {
  handleLoginRequestClick(self) {
    return event => {
      const { apiInfo, login } = self.props;

      const token = event.target.value;

      return login(apiInfo.apiUrl, 'a', 'b');
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
      console.log('username', event.target.value);
    };
  }

  render() {
    return (
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
          />
          <div className="help-block with-errors" />
        </div>
        <div id="enter-phone" className="form-group">
          <label htmlFor="password">Enter your password</label>
          <input
            type="tel"
            id="password"
            name="password"
            className="form-input form-input--medium"
            placeholder="e.g. 1234567890"
            required
          />
          <div className="help-block with-errors" />
        </div>

        <div>
          <button onClick={this.handleLoginRequestClick(this)}>Login</button>
        </div>
        <Driver />
      </div>
    );
  }
}

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBase);

export default App;

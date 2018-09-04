import React, { Component } from 'react';
import { connect } from 'react-redux';

import LoginArea from './LoginArea.jsx';
import Driver from './Driver.jsx';
import RidersList from './RidersList.bs.js';
import Riders from './Riders.bs.js';

import { loginDetails, login, loginSuccess, logout } from '../actions/index.js';

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

class AppBase extends Component {
  render() {
    return (
      <div>
        <LoginArea />
        <Driver />
        <Riders riders="test" />
        <RidersList />
      </div>
    );
  }
}

/*
  
  */

//         <RidersList />
//         <Riders />

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBase);

export default App;

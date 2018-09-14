import React, { Component } from 'react';
import { connect } from 'react-redux';

import LoginArea from './LoginArea.jsx';
import Driver from './Driver.jsx';
import Riders from './RidersPlus.jsx';

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

class AppBase extends Component {
  render() {
    return (
      <div>
        <LoginArea />
        <Driver />
        <Riders />
      </div>
    );
  }
}

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBase);

export default App;

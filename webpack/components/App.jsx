import React, { Component } from 'react';
import { connect } from 'react-redux';

import LoginArea from './LoginArea.jsx';
import Driver from './Driver.jsx';
import Riders from './RidersPlus.jsx';
import Matches from './MatchesPlus.jsx';
import MatchesOtherDriver from './MatchesOtherDriverPlus.jsx';

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

class AppBase extends Component {
  render() {
    return (
      <div>
        <LoginArea />
        <Driver />
        <Riders />
        <Matches sectionHeading="Matches Info" />
        <MatchesOtherDriver sectionHeading="Matches Other Driver Info" />
      </div>
    );
  }
}

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBase);

export default App;

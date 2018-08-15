import React, { Component } from 'react';
import { connect } from 'react-redux';

import Driver from './Driver.jsx';

import { loginSuccess } from '../actions/index.js';

const mapStateToProps = state => {
    const {loginInfo} = state;

    return {loginInfo};
}

const mapDispatchToProps = dispatch => {
    return {
        handleLoginSuccess: loginSuccess(dispatch)
    };
}

class AppBase extends Component {
    handleLoginSuccessClick(self) {
        return event => {
            const { handleLoginSuccess } = self.props;

            const token = event.target.value;

            return handleLoginSuccess(token);
        }
    }

    render() {    
        return (
            <div>
                <div>
                    <button onClick={this.handleLoginSuccessClick(this)}>Login</button>
                </div>
                <Driver />
            </div>)
    }
}

const App = connect(mapStateToProps, mapDispatchToProps)(AppBase);

export default App;

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Driver from './Driver.jsx';

import { login, loginSuccess } from '../actions/index.js';

const mapStateToProps = state => {
    const {loginInfo} = state;

    return {loginInfo};
}

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
            const { login } = self.props;

            const token = event.target.value;

            return login(token);
        }
    }

    handleLoginSuccessClick(self) {
        return event => {
            const { loginSuccess } = self.props;

            const token = event.target.value;

            return loginSuccess(token);
        }
    }

    render() {    
        return (
            <div>
                <div>
                    <button onClick={this.handleLoginRequestClick(this)}>Login</button>
                </div>
                <Driver />
            </div>)
    }
}

const App = connect(mapStateToProps, mapDispatchToProps)(AppBase);

export default App;

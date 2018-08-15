import React, { Component } from 'react';
import { render } from 'react-dom';
import Driver from './components/Driver.jsx';

console.log("entry.js sttxx xnloaded");

class App extends Component {
    render() {
        return <Driver />
    }
}

render(<App />, document.getElementById('root'));

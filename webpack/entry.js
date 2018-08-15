import React, { Component } from 'react';
import { render } from 'react-dom';
import {createStore} from 'redux';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import rootReducer from './reducers/index.js';

console.log("entry.js sttxx xnloaded");

const store = createStore(rootReducer);

render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root'));

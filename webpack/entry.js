import React, { Component } from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import App from './components/App.jsx';
import rootReducer from './reducers/index.js';
import loginSaga from './actions/sagas';

console.log("entry.js sttxx xnloaded");

const sagaMiddleware = createSagaMiddleware();

const store = createStore( rootReducer, applyMiddleware(sagaMiddleware) );

sagaMiddleware.run(loginSaga);

render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root'));

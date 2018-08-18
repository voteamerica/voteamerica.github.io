import React, { Component } from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import App from './components/App.jsx';
import rootReducer from './reducers/index.js';
import loginSaga from './actions/sagas.js';
import driversListSaga from './actions/sagaDriversList.js';

console.log('entry.js sttxx xnloaded');

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

function* allSagas() {
  yield all([fork(loginSaga), fork(driversListSaga)]);
}

sagaMiddleware.run(allSagas);
// sagaMiddleware.run(loginSaga);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

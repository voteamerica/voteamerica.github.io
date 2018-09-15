import { combineReducers } from 'redux';
import apiInfo from './apiInfo';
import loginInfo from './loginInfo.js';
import driversInfo from './driversInfo';
import ridersInfo from './ridersInfo';
import matchesInfo from './matchesInfo';

export default combineReducers({
  apiInfo,
  loginInfo,
  driversInfo,
  ridersInfo,
  matchesInfo
});

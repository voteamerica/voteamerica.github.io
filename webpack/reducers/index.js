import { combineReducers } from 'redux';
import apiInfo from './apiInfo';
import loginInfo from './loginInfo.js';
import driversInfo from './driversInfo';
import ridersInfo from './ridersInfo';
import matchesInfo from './matchesInfo';
import matchesOtherDriverInfo from './matchesOtherDriverInfo';
import uploadInfo from './uploadInfo';
import inputFormsInfo from './inputFormsInfo';

export default combineReducers({
  apiInfo,
  loginInfo,
  driversInfo,
  ridersInfo,
  matchesInfo,
  matchesOtherDriverInfo,
  uploadInfo,
  inputFormsInfo
});

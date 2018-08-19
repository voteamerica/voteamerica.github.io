import { combineReducers } from 'redux';
import apiInfo from './apiInfo';
import loginInfo from './loginInfo.js';
import driversInfo from './driversInfo';

export default combineReducers({ apiInfo, loginInfo, driversInfo });

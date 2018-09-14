import { combineReducers } from 'redux';
import apiInfo from './apiInfo';
import loginInfo from './loginInfo.js';
import driversInfo from './driversInfo';
import ridersInfo from './ridersInfo';

export default combineReducers({ apiInfo, loginInfo, driversInfo, ridersInfo });

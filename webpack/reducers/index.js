import { combineReducers } from 'redux';
import apiInfo from './apiInfo';
import loginInfo from './loginInfo.js';

export default combineReducers({ apiInfo, loginInfo});
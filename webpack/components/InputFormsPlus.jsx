import { connect } from 'react-redux';

import InputFormsBase from './InputForms.bs.js';

import {
  setDriverDateInfo,
  setDriverFormInfo,
  setRiderDateInfo,
  setRiderFormInfo
} from '../actions/index.js';

const mapStateToProps = state => {
  const { apiInfo, loginInfo, inputFormsInfo } = state;

  return { apiInfo, loginInfo, inputFormsInfo };
};

const mapDispatchToProps = {
  setDriverDateInfo,
  setDriverFormInfo,
  setRiderDateInfo,
  setRiderFormInfo
};

const InputFormsPlus = connect(
  mapStateToProps,
  mapDispatchToProps
)(InputFormsBase);

export default InputFormsPlus;

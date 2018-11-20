import { driverSetDateInfoType, riderSetDateInfoType } from '../actions/types';

const inputFormsInfo = (
  state = {
    // validator: {}   function initFormValidator() {
    driverInfo: {
      startDateChanged: false,
      endDateChanged: false,
      emailRequired: false,
      jsonTimesUpdated: false,
      availableDates: [],
      dateInfo: { date: '', timeStart: '', timeEnd: '' }
    },
    riderInfo: {
      startDateChanged: false,
      endDateChanged: false,
      emailRequired: false,
      jsonTimesUpdated: false,
      availableDates: [],
      dateInfo: { date: '', timeStart: '', timeEnd: '' }
    }
  },
  action
) => {
  switch (action.type) {
    case driverSetDateInfoType: {
      const { dateInfo } = action.payload;
      const newDriverInfo = { ...state.driverInfo, dateInfo };

      const newState = { ...state, driverInfo: newDriverInfo };

      return newState;
    }

    case riderSetDateInfoType: {
      const { dateInfo } = action.payload;
      const newRiderInfo = { ...state.riderInfo, dateInfo };

      const newState = { ...state, riderInfo: newRiderInfo };

      return newState;
    }

    default:
      return state;
  }
};

export default inputFormsInfo;

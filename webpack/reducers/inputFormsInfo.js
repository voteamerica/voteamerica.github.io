import {
  driverSetDateInfoType,
  driverSetFormInfoType,
  riderSetDateInfoType,
  riderSetFormInfoType
} from '../actions/types';

const inputFormsInfo = (
  state = {
    // validator: {}   function initFormValidator() {
    driverInfo: {
      startDateChanged: false,
      endDateChanged: false,
      emailRequired: false,
      jsonTimesUpdated: false,
      availableDates: [],
      dateInfo: { date: '', timeStart: '06:00', timeEnd: '22:00' }
    },
    riderInfo: {
      startDateChanged: false,
      endDateChanged: false,
      emailRequired: false,
      jsonTimesUpdated: false,
      collectionAddress: '',
      collectionZip: '',
      destinationAddress: '',
      destinationZip: '',
      seatCount: 0,
      powerChairUser: false,
      twoWayTripNeeded: false,
      otherRequirements: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      cellPhone: false,
      emailPreferred: false,
      phonePreferred: false,
      smsPreferred: false,
      agreeTandC: false,
      contactOk: false,
      orgName: 'None',
      availableDates: [],
      dateInfo: { date: '', timeStart: '06:00', timeEnd: '22:00' }
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

    case driverSetFormInfoType: {
      const { formInfo: newDriverInfo } = action.payload;

      const newState = { ...state, driverInfo: newDriverInfo };

      return newState;
    }

    case riderSetFormInfoType: {
      const { formInfo: newRiderInfo } = action.payload;

      const newState = { ...state, riderInfo: newRiderInfo };

      return newState;
    }

    default:
      return state;
  }
};

export default inputFormsInfo;

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
      driverZip: '',
      driverRadius: '',
      seatsAvailable: 0,
      powerChairSupport: false,
      hasInsurance: false,
      licenceNumber: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      emailPreferred: false,
      smsPreferred: false,
      agreeTandC: false,
      contactOk: false,
      orgName: 'None',
      availableDates: [],
      driverDateInfo: { date: '', timeStart: '06:00', timeEnd: '22:00' }
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
  let dateInfoUpdate = (key, dateFieldName, driverOrRiderInfo) => {
    const { dateInfo } = action.payload;
    const newInfo = { ...driverOrRiderInfo, [dateFieldName]: dateInfo };

    const newState = { ...state, [key]: newInfo };

    return newState;
  };

  let driverOrRiderInfoUpdate = key => {
    const { formInfo: newDriverOrRiderInfo } = action.payload;

    const newState = { ...state, [key]: newDriverOrRiderInfo };

    return newState;
  };

  switch (action.type) {
    case driverSetDateInfoType:
      return dateInfoUpdate('driverInfo', 'driverDateInfo', state.driverInfo);

    case riderSetDateInfoType:
      return dateInfoUpdate('riderInfo', 'dateInfo', state.riderInfo);

    case driverSetFormInfoType:
      return driverOrRiderInfoUpdate('driverInfo');

    case riderSetFormInfoType:
      return driverOrRiderInfoUpdate('riderInfo');

    default:
      return state;
  }
};

export default inputFormsInfo;

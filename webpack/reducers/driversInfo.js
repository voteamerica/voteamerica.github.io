import { getDriverListTypes, HIDE_DRIVERS_LIST } from '../actions/types';

const driversInfo = (
  state = { showDriversList: false, drivers: [] },
  action
) => {
  switch (action.type) {
    case getDriverListTypes.success: {
      const { data: drivers } = action.payload;

      return { ...state, showDriversList: true, drivers };
    }
    case HIDE_DRIVERS_LIST:
      return { ...state, showDriversList: false, drivers: [] };
    default:
      return state;
  }
};

export default driversInfo;

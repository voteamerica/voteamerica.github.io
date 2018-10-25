import { UPLOAD_FILE_CHOSEN } from '../actions/types.js';

const uploadInfo = (state = { fileDetails: {}, fileChosen: false }, action) => {
  switch (action.type) {
    case UPLOAD_FILE_CHOSEN: {
      const { payload } = action;
      const { fileDetails } = payload;

      // const fileChosen = filenameTest !== undefined && filenameTest.length > 0;

      // const filename = filenameTest !== undefined ? filenameTest : '';

      const newState = {
        ...state,
        fileDetails,
        fileChosen: true
      };

      return newState;
    }

    default:
      return state;
  }
};

export default uploadInfo;

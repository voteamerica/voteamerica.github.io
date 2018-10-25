import {
  UPLOAD_FILE_CHOSEN,
  POST_UPLOAD,
  postUploadAsyncTypes
} from '../actions/types.js';

const uploadInfo = (
  state = {
    fileDetails: {},
    fileChosen: false,
    fileBeingProcessed: false,
    showProcessingResults: false,
    processingResults: {
      recordsReceived: 0,
      uploadCount: 0,
      inputErrors: [],
      inputErrorsCount: 0
    }
  },
  action
) => {
  switch (action.type) {
    case UPLOAD_FILE_CHOSEN: {
      const { payload } = action;
      const { fileDetails } = payload;

      // const fileChosen = filenameTest !== undefined && filenameTest.length > 0;

      // const filename = filenameTest !== undefined ? filenameTest : '';

      const newState = {
        ...state,
        fileDetails,
        fileChosen: true,
        showProcessingResults: false
      };

      return newState;
    }

    case POST_UPLOAD: {
      const newState = {
        ...state,
        fileBeingProcessed: true,
        showProcessingResults: false
      };

      return newState;
    }

    case postUploadAsyncTypes.success: {
      const { data: processingResults } = action.payload;
      const showProcessingResults = true;
      const fileBeingProcessed = false;

      if (processingResults.recordsReceived !== undefined)
        return {
          ...state,
          showProcessingResults,
          fileBeingProcessed,
          processingResults
        };
      else if (
        processingResults.recordsReceived === undefined &&
        processingResults.err &&
        processingResults.err.inputErrors
      ) {
        // system processed csv successfully but at least some rows were not added to db

        let newProcessingResults = {
          inputErrors: processingResults.err.inputErrors,
          inputErrorsCount: processingResults.err.inputErrorsCount
        };

        const replyDetailsLength = processingResults.err.replyDetailsLength;

        if (replyDetailsLength) {
          newProcessingResults = {
            ...newProcessingResults,
            recordsReceived: replyDetailsLength.recordsReceived,
            uploadCount: replyDetailsLength.uploadCount
          };
        }

        return {
          ...state,
          showProcessingResults,
          fileBeingProcessed,
          processingResults: newProcessingResults
        };
      } else {
        return state;
      }
    }

    default:
      return state;
  }
};

export default uploadInfo;

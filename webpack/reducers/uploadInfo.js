import {
  UPLOAD_FILE_CHOSEN,
  POST_UPLOAD,
  postUploadAsyncTypes
} from '../actions/types.js';

const defaultProcessingResults = {
  recordsReceived: 0,
  uploadCount: 0,
  inputErrors: [],
  inputErrorsCount: 0,
  entireFailError: '',
  entireFailType: ''
};

const uploadInfo = (
  state = {
    fileDetails: {},
    fileChosen: false,
    fileBeingProcessed: false,
    showProcessingResults: false,
    showEntireFailInfo: false,
    processingResults: defaultProcessingResults
  },
  action
) => {
  switch (action.type) {
    case UPLOAD_FILE_CHOSEN: {
      const { payload } = action;
      const { fileDetails } = payload;

      const newState = {
        ...state,
        fileDetails,
        fileChosen: true,
        showProcessingResults: false,
        showEntireFailInfo: false
      };

      return newState;
    }

    case POST_UPLOAD: {
      const newState = {
        ...state,
        fileBeingProcessed: true,
        showProcessingResults: false,
        showEntireFailInfo: false,
        processingResults: defaultProcessingResults
      };

      return newState;
    }

    case postUploadAsyncTypes.error: {
      const { message, errorInfo } = action.payload;
      const fileBeingProcessed = false;

      const processingResults = {
        ...state.processingResults,
        entireFailError: message,
        entireFailType:
          errorInfo.response.statusText +
          ' - Status Code: ' +
          errorInfo.response.status
      };

      // system did not process csv successfully, no rows were not added to db
      return {
        ...state,
        fileBeingProcessed,
        showEntireFailInfo: true,
        processingResults
      };
    }

    case postUploadAsyncTypes.fail: {
      const { data: newProcessingResults } = action.payload;
      const fileBeingProcessed = false;

      const processingResults = {
        ...state.processingResults,
        entireFailError: newProcessingResults.error,
        entireFailType: newProcessingResults.type
      };

      // system did not process csv successfully, no rows were not added to db
      return {
        ...state,
        fileBeingProcessed,
        showEntireFailInfo: true,
        processingResults
      };
    }

    case postUploadAsyncTypes.success: {
      const { data: processingResults } = action.payload;
      const showProcessingResults = true;
      const fileBeingProcessed = false;

      if (processingResults.recordsReceived !== undefined) {
        // system processed csv successfully, all rows were not added to db
        return {
          ...state,
          showProcessingResults,
          fileBeingProcessed,
          processingResults
        };
      } else if (
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

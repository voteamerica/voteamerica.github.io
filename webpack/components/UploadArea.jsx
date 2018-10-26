import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { postUploadFile, uploadFileChosen } from '../actions/index.js';

const SubmitButton = styled.button`
  margin-top: 0px;
  margin-bottom: 20px;
`;

const UploadInfoDiv = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const UploadInfoListItemDiv = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const mapStateToProps = state => {
  const { apiInfo, loginInfo, uploadInfo } = state;

  return { apiInfo, loginInfo, uploadInfo };
};

const mapDispatchToProps = {
  uploadFileChosen,
  postUploadFile
};

class UploadAreaBase extends Component {
  fileChoiceButtonClickHandler(self) {
    return event => {
      const { uploadFileChosen } = self.props;
      event.preventDefault();

      const fileDetails = event.target.files[0];

      return uploadFileChosen(fileDetails);
    };
  }

  postButtonClickHandler(self) {
    return event => {
      const { apiInfo, loginInfo, uploadInfo, postUploadFile } = self.props;

      event.preventDefault();

      if (
        uploadInfo.fileDetails === undefined ||
        uploadInfo.fileDetails === {}
      ) {
        return;
      }

      const token = loginInfo.token || '';

      return postUploadFile(apiInfo.apiUrl, token, uploadInfo.fileDetails);
    };
  }

  render() {
    const { uploadInfo, loginInfo } = this.props;

    const fileChoiceStyle = { marginBottom: 20 };

    const notAllRowsInputIntoDb =
      uploadInfo.processingResults.recordsReceived >
      uploadInfo.processingResults.uploadCount;

    const errorsLoadedStyle = notAllRowsInputIntoDb ? { color: 'red' } : {};

    const errorDataRowStyle = {};

    return (
      <div id="uploadArea">
        {loginInfo.loggedIn === true ? (
          <div>
            <h2 style={{ marginTop: 40 }}>Upload Area</h2>
            <p>
              <span>
                <strong>IMPORTANT:</strong>
              </span>
              &nbsp; take care not to upload the same file twice, as this will
              create duplicates on the system
            </p>
            <form
              action="http://localhost:8000/bulk-upload"
              method="post"
              encType="multipart/form-data"
            >
              <div>
                <div style={fileChoiceStyle}>
                  <label htmlFor="file">Choose file to upload</label>
                  <input
                    style={{ marginTop: 10 }}
                    type="file"
                    id="file"
                    name="file"
                    onChange={this.fileChoiceButtonClickHandler(this)}
                  />
                </div>
                {uploadInfo.fileChosen === true &&
                uploadInfo.fileBeingProcessed === false ? (
                  <div>
                    <SubmitButton
                      className="button button--large"
                      id="postUploadButton"
                      onClick={this.postButtonClickHandler(this)}
                    >
                      Submit
                    </SubmitButton>
                  </div>
                ) : (
                  <div>
                    {uploadInfo.fileChosen === true &&
                    uploadInfo.fileBeingProcessed === true ? (
                      <div>File being processed </div>
                    ) : (
                      false
                    )}
                  </div>
                )}
                {uploadInfo.fileChosen === true &&
                uploadInfo.fileBeingProcessed === false &&
                uploadInfo.showEntireFailInfo === true ? (
                  <div>
                    <UploadInfoDiv>
                      <span>
                        <strong style={{ color: 'red' }}>IMPORTANT:</strong>
                        &nbsp;
                        <strong>NO</strong>
                        &nbsp; records were input into the db. Review the
                        information below to resolve this.
                      </span>
                    </UploadInfoDiv>
                    <UploadInfoDiv>
                      <strong>Error message:&nbsp;</strong>
                      {uploadInfo.processingResults.entireFailError}
                    </UploadInfoDiv>
                    <UploadInfoDiv>
                      <strong>Error type:&nbsp;</strong>
                      <span style={errorsLoadedStyle}>
                        {uploadInfo.processingResults.entireFailType}
                      </span>
                    </UploadInfoDiv>
                  </div>
                ) : (
                  false
                )}
                {uploadInfo.fileChosen === true &&
                uploadInfo.fileBeingProcessed === false &&
                uploadInfo.showProcessingResults === true ? (
                  <div>
                    {notAllRowsInputIntoDb ? (
                      <div>
                        <span>
                          <strong style={{ color: 'red' }}>IMPORTANT:</strong>{' '}
                          Not all records were input into the db. Review the
                          information below to resolve this.
                        </span>
                      </div>
                    ) : (
                      false
                    )}

                    <UploadInfoDiv>
                      Records received:&nbsp;
                      {uploadInfo.processingResults.recordsReceived}
                    </UploadInfoDiv>
                    <UploadInfoDiv>
                      Records loaded into db:&nbsp;
                      <span style={errorsLoadedStyle}>
                        {uploadInfo.processingResults.uploadCount}
                      </span>
                    </UploadInfoDiv>
                    {uploadInfo.processingResults.inputErrorsCount &&
                    uploadInfo.processingResults.inputErrorsCount > 0 ? (
                      <UploadInfoDiv>
                        Input errors count:&nbsp;
                        {uploadInfo.processingResults.inputErrorsCount}
                      </UploadInfoDiv>
                    ) : (
                      false
                    )}
                    {uploadInfo.processingResults.inputErrors &&
                    uploadInfo.processingResults.inputErrors.length > 0 ? (
                      <UploadInfoDiv>
                        <h3>Input errors:</h3>
                        <ul>
                          {uploadInfo.processingResults.inputErrors.map(
                            (r, index) => (
                              <li key={index}>
                                <UploadInfoListItemDiv>
                                  <strong>Error type: </strong>
                                  {r.type.toString()}
                                </UploadInfoListItemDiv>
                                <UploadInfoListItemDiv>
                                  <strong>Db error: </strong>
                                  {r.error.toString()}
                                </UploadInfoListItemDiv>
                                <UploadInfoListItemDiv>
                                  <strong>Data row:</strong>
                                  <div style={{ marginTop: 8 }}>
                                    {JSON.stringify(r.data)}
                                  </div>
                                </UploadInfoListItemDiv>
                              </li>
                            )
                          )}
                        </ul>
                      </UploadInfoDiv>
                    ) : (
                      false
                    )}
                  </div>
                ) : (
                  false
                )}
              </div>
            </form>
          </div>
        ) : (
          false
        )}
      </div>
    );
  }
}

const UploadArea = connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadAreaBase);

export default UploadArea;

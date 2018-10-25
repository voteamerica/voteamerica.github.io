import React, { Component } from 'react';
import { connect } from 'react-redux';

import { postUploadFile, uploadFileChosen } from '../actions/index.js';

const mapStateToProps = state => {
  const { apiInfo, loginInfo, uploadInfo } = state;

  return { apiInfo, loginInfo, uploadInfo };
};

const mapDispatchToProps = {
  // loginDetails,
  // login,
  // loginSuccess,
  // logout,
  // getDriversList,
  // getRidersList,
  // getMatchesList,
  // getMatchesOtherDriverList
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
    const { loginInfo } = this.props;

    return (
      <div id="uploadArea">
        {loginInfo.loggedIn === true ? (
          <div>
            <h2 style={{ marginTop: 40 }}>Upload Area</h2>
            <p>
              NOTE: take care not to upload the same file twice, as this will
              create duplicates on the system
            </p>
            <form
              action="http://localhost:8000/bulk-upload"
              method="post"
              encType="multipart/form-data"
            >
              <div>
                <div>
                  <label htmlFor="file">Choose file to upload</label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={this.fileChoiceButtonClickHandler(this)}
                  />
                </div>
                <div>
                  <button
                    className="button button--large"
                    id="postUploadButton"
                    onClick={this.postButtonClickHandler(this)}
                  >
                    Submit
                  </button>
                </div>
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

/*

*/

const UploadArea = connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadAreaBase);

export default UploadArea;

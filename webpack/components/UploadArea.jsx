import React, { Component } from 'react';
import { connect } from 'react-redux';

import {} from '../actions/index.js';

const mapStateToProps = state => {
  // const { apiInfo, loginInfo } = state;

  // return { apiInfo, loginInfo };

  return {};
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
};

class UploadAreaBase extends Component {
  render() {
    return (
      <div id="uploadArea">
        <form
          action="http://localhost:8000/bulk-upload"
          method="post"
          encType="multipart/form-data"
        >
          <div>
            <div>
              <label htmlFor="file">Choose file to upload</label>
              <input type="file" id="file" name="file" multiple />
            </div>
            <div>
              <button>Submit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const UploadArea = connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadAreaBase);

export default UploadArea;

import React, { Component } from 'react';

// const hoc = wc => props => {
// return (
//   <div>
//     <wc {...props} />
//   </div>
// );
// };

const ExDate = BasicDate =>
  class Ex extends Component {
    constructor(props) {
      super(props);
    }

    // componentWillReceiveProps(nextProps) {
    //   if (nextProps.value !== this.props.value) {
    //     if (typeof this.props.onChange === 'function') {
    //       this.props.onChange(nextProps.name, nextProps.value);
    //     }
    //   }
    // }

    render() {
      return <BasicDate {...this.props} />;
    }
  };

const basicDate = props => <input {...props} />;

const NewDate = ExDate(basicDate);

export default NewDate;

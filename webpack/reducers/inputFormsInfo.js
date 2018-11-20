const inputFormsInfo = (
  state = {
    // validator: {}   function initFormValidator() {
    startDateChanged: false,
    endDateChanged: false,
    emailRequired: false,
    jsonTimesUpdated: false
  },
  action
) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default inputFormsInfo;

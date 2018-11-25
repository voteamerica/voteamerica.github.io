let component = ReasonReact.statelessComponent("InputForms");

[@bs.val] external spreadRiderString : (TypeInfo.inputFormsInfoRiderInfo, string, string) => TypeInfo.inputFormsInfoRiderInfo = "spreadObject";
[@bs.val] external spreadRiderBool : (TypeInfo.inputFormsInfoRiderInfo, string, bool) => TypeInfo.inputFormsInfoRiderInfo = "spreadObject";

[@bs.val] external spreadDateString : (TypeInfo.inputFormsDateInfo, string, string) => TypeInfo.inputFormsDateInfo = "spreadObject";

[@bs.val] external spreadDriverString : (TypeInfo.inputFormsInfoDriverInfo, string, string) => TypeInfo.inputFormsInfoDriverInfo = "spreadObject";
[@bs.val] external spreadDriverBool : (TypeInfo.inputFormsInfoDriverInfo, string, bool) => TypeInfo.inputFormsInfoDriverInfo = "spreadObject";


[@bs.val] external formatAvailabilityPeriod : (string, string, string,) => string = "formatAvailabilityPeriod";


[@bs.deriving abstract]
type dateExtraJsProps = {
  id: string,
  className: string,
  [@bs.as "type"] type_: string,
  name: string,
  value: string,
  required: bool,
  onChange: ReactEvent.Form.t => unit,
};

[@bs.deriving abstract]
type jsProps = {
  loginInfo: TypeInfo.loginInfo,
  apiInfo: TypeInfo.apiInfo,
  inputFormsInfo: TypeInfo.inputFormsInfo,
  setDriverDateInfo: (int, TypeInfo.inputFormsDateInfo) => unit, 
  setDriverFormInfo: TypeInfo.inputFormsInfoDriverInfo => unit,
  setRiderDateInfo: (int, TypeInfo.inputFormsDateInfo) => unit,
  setRiderFormInfo: TypeInfo.inputFormsInfoRiderInfo => unit
};

let make = (~loginInfo:TypeInfo.loginInfo, 
    ~apiInfo:TypeInfo.apiInfo, 
    ~inputFormsInfo: TypeInfo.inputFormsInfo, 
    ~setDriverDateInfo,
    ~setDriverFormInfo,
    ~setRiderDateInfo,
    ~setRiderFormInfo,
    _children) => {

  let url = apiInfo->TypeInfo.apiUrlGet;
  let siteUrl = apiInfo->TypeInfo.siteUrlGet;

  /* Js.log(url);
  Js.log(siteUrl); */
      
  let riderTypeName = "Rider";  
  let driverTypeName = "Driver";  
  let rowId = 0;
  let rowIdAsText = string_of_int(rowId);
  
  /* https://stackoverflow.com/questions/49039433/how-to-add-a-copyright-symbol-in-reason-react-component */
  let hmtlPlusEntity = <span dangerouslySetInnerHTML={{ "__html": "&plus;" }}></span>;
  let hmtlTimesEntity = <span dangerouslySetInnerHTML={{ "__html": "&times;" }}></span>;
  let hmtlAmpEntity = <span dangerouslySetInnerHTML={{ "__html": "&amp;" }}></span>;

  let regexPattern="(^\\d{5}$)|(^\\d{5}-\\d{4}$)";

  let withDataAttributes = (data, element) => ReasonReact.cloneElement(element, ~props=Obj.magic(Js.Dict.fromList(data)), [||]);
    
  let inputDateSection = (fragment, data) => withDataAttributes(data, fragment);

  let inputId = (typeName, rowIdAsText, sectionName) => typeName ++ sectionName ++ rowIdAsText;

  /* NOTE: without this step, dispatch prop does not work correctly - best to use typed version of bs raw section, in part because dispatch prop is optimised out of the function if not referenced in some way */
  let srdi: ((int, TypeInfo.inputFormsDateInfo) => unit, int, TypeInfo.inputFormsDateInfo) => unit = [%raw (fx, index, dateInfo) => "{ fx(index, dateInfo); return 0; }"];

  let dateChangeSupport = (action, evt, dateInfo, dateTimeFieldName, index) => {
    let dateOrTime = ReactEvent.Form.target(evt)##value;
    let newDateInfo = spreadDateString(dateInfo, dateTimeFieldName, dateOrTime);

    srdi(action, index, newDateInfo);

    ();
  }

  /* TEST support start */
  let testDateChangeSupport = (action, dateInfo, dateTimeFieldName, index) => {
    let dateOrTime = "2019-10-30";
    let newDateInfo = spreadDateString(dateInfo, dateTimeFieldName, dateOrTime);

    srdi(action, index, newDateInfo);

    ();
  }

  let testRiderDateChangeHandler = (evt) => {    
    ReactEvent.Mouse.preventDefault(evt);

    testDateChangeSupport(setRiderDateInfo, inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.dateInfoGet, "date", rowId);

    ();
  }

  let testDriverDateChangeHandler = (evt) => {    
    ReactEvent.Mouse.preventDefault(evt);

    testDateChangeSupport(setDriverDateInfo, inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.driverDateInfoGet, "date", rowId);

    ();
  }
  /* TEST support end */

  let riderDateChangeHandler = evt => {
    dateChangeSupport(setRiderDateInfo, evt, inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.dateInfoGet, "date", rowId);

    ();
  }

  let riderStartTimeChangeHandler = evt => {
    dateChangeSupport(setRiderDateInfo, evt, inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.dateInfoGet, "timeStart", rowId);

    ();
  }

  let riderEndTimeChangeHandler = evt => {
    dateChangeSupport(setRiderDateInfo, evt, inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.dateInfoGet, "timeEnd", rowId);

    ();
  }

  let driverDateChangeHandler = evt => {
    dateChangeSupport(setDriverDateInfo, evt, inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.driverDateInfoGet, "date", rowId);

    ();
  }

  let driverStartTimeChangeHandler = evt => {
    dateChangeSupport(setDriverDateInfo, evt, inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.driverDateInfoGet, "timeStart", rowId);

    ();
  }

  let driverEndTimeChangeHandler = evt => {
    dateChangeSupport(setDriverDateInfo, evt, inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.driverDateInfoGet, "timeEnd", rowId);

    ();
  }


  /* Use of "type_" doesn't seem to compile to "type" */
  let eventTargetType: Js.t({..}) => string = [%raw target => "{ return target.type; }"];

  /* NOTE: without this step, dispatch prop does not work correctly - best to use typed version of bs raw section, in part because dispatch prop is optimised out of the function if not referenced in some way */
  let srfi: ((TypeInfo.inputFormsInfoRiderInfo) => unit, TypeInfo.inputFormsInfoRiderInfo) => unit = [%raw (fx, formInfo) => "{ fx(formInfo); return 0; }"];

  let srfiString = (key, change) => {
    let newRiderInfo = spreadRiderString(inputFormsInfo->TypeInfo.riderInfoGet, key, change);

    srfi(setRiderFormInfo, newRiderInfo);

    ();
}

  let srfiNumber = (key, change) => {
    let newRiderInfo = spreadRiderBool(inputFormsInfo->TypeInfo.riderInfoGet, key, change);

    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let srfiBool = (key, change) => {
    let newRiderInfo = spreadRiderBool(inputFormsInfo->TypeInfo.riderInfoGet, key, change);

    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let riderFormInfoChangeSupportNewRider = (evt, key) => {
    let targetType = eventTargetType(ReactEvent.Form.target(evt));

    switch (targetType) {
    | "checkbox" => {
        let change = ReactEvent.Form.target(evt)##checked;
        srfiBool(key, change);
        }
    | "radio" => {
        let change = ReactEvent.Form.target(evt)##value == "Yes";
        srfiBool(key, change);
        }
    | "number" => {
        let change = ReactEvent.Form.target(evt)##value;
        srfiNumber(key, change);
        }
    | _ =>  {
        let change = ReactEvent.Form.target(evt)##value;
        srfiString(key, change);
        }
    };

    ();
  }
  
  /* NOTE: without this step, dispatch prop does not work correctly - best to use typed version of bs raw section, in part because dispatch prop is optimised out of the function if not referenced in some way */
  let sdfi: ((TypeInfo.inputFormsInfoDriverInfo) => unit, TypeInfo.inputFormsInfoDriverInfo) => unit = [%raw (fx, formInfo) => "{ fx(formInfo); return 0; }"];

  let sdfiString = (key, change) => {
    let newDriverInfo = spreadDriverString(inputFormsInfo->TypeInfo.driverInfoGet, key, change);

    sdfi(setDriverFormInfo, newDriverInfo);

    ();
}

  let sdfiNumber = (key, change) => {
    let newDriverInfo = spreadDriverBool(inputFormsInfo->TypeInfo.driverInfoGet, key, change);

    sdfi(setDriverFormInfo, newDriverInfo);

    ();
  }

  let sdfiBool = (key, change) => {
    let newDriverInfo = spreadDriverBool(inputFormsInfo->TypeInfo.driverInfoGet, key, change);

    sdfi(setDriverFormInfo, newDriverInfo);

    ();
  }

  let driverFormInfoChangeSupportNewDriver = (evt, key) => {
    let targetType = eventTargetType(ReactEvent.Form.target(evt));

    switch (targetType) {
    | "checkbox" => {
        let change = ReactEvent.Form.target(evt)##checked;
        sdfiBool(key, change);
        }
    | "radio" => {
        let change = ReactEvent.Form.target(evt)##value == "Yes";
        sdfiBool(key, change);
        }
    | "number" => {
        let change = ReactEvent.Form.target(evt)##value;
        sdfiNumber(key, change);
        }
    | _ =>  {
        let change = ReactEvent.Form.target(evt)##value;
        sdfiString(key, change);
        }
    };

    ();
  }
  
  let riderCollectionAddressChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "collectionAddress");   
    ();
  }

  let riderCollectionZipChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "collectionZip");   

    ();
  }

  let riderDestinationAddressChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "destinationAddress");   
    ();
  }

  let riderDestinationZipChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "destinationZip");   

    ();
  }

  let riderSeatCountChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "seatCount");   

    ();
  }

  let riderPowerChairUserChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "powerChairUser");   

    ();
  }

  let riderTwoWayTripNeededChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "twoWayTripNeeded");   

    ();
  }

  let riderOtherRequirementsChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "otherRequirements");   
    ();
  }

  let riderFirstNameChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "firstName");   

    ();
  }

  let riderLastNameChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "lastName");   

    ();
  }

  let riderEmailChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "email");   

    ();
  }

  let riderPhoneChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "phone");   

    ();
  }

  let riderCellPhoneChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "cellPhone");   

    ();
  }

  let riderEmailPreferredChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "emailPreferred");   

    ();
  }

  let riderPhonePreferredChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "phonePreferred");   

    ();
  }

  let ridersmsPreferredChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "smsPreferred");   

    ();
  }

  let riderAgreeTandCChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "agreeTandC");   

    ();
  }

  let riderContactOkChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "contactOk");   

    ();
  }

  let riderOrgNameChangeHandler = evt => {
    riderFormInfoChangeSupportNewRider(evt, "orgName");   

    ();
  }

  /* driver change handlers */
  let driverZipChangeHandler = evt => {
    driverFormInfoChangeSupportNewDriver(evt, "driverZip");   

    ();
  }

  let driverRadiusChangeHandler = evt => {
    driverFormInfoChangeSupportNewDriver(evt, "driverRadius");   

    ();
  }

  let driverSeatsAvailableChangeHandler = evt => {
    driverFormInfoChangeSupportNewDriver(evt, "seatsAvailable");   

    ();
  }

  let driverPowerchairSupportChangeHandler = evt => {
    driverFormInfoChangeSupportNewDriver(evt, "powerChairSupport");   

    ();
  }

  let driverHasInsuranceChangeHandler = evt => {
    driverFormInfoChangeSupportNewDriver(evt, "hasInsurance");   

    ();
  }

  let driverLicenceNumberChangeHandler = evt => {
    driverFormInfoChangeSupportNewDriver(evt, "licenceNumber");   

    ();
  }

  let driverFirstNameChangeHandler = evt => {
    driverFormInfoChangeSupportNewDriver(evt, "firstName");   

    ();
  }

  let driverLastNameChangeHandler = evt => {
    driverFormInfoChangeSupportNewDriver(evt, "lastName");   

    ();
  }

  let driverEmailChangeHandler = evt => {
    driverFormInfoChangeSupportNewDriver(evt, "email");   

    ();
  }

  let driverPhoneChangeHandler = evt => {
    driverFormInfoChangeSupportNewDriver(evt, "phone");   

    ();
  }

  let driverEmailPreferredChangeHandler = evt => {
    driverFormInfoChangeSupportNewDriver(evt, "emailPreferred");   

    ();
  }

  let driversmsPreferredChangeHandler = evt => {
    driverFormInfoChangeSupportNewDriver(evt, "smsPreferred");   

    ();
  }

  let driverAgreeTandCChangeHandler = evt => {
    driverFormInfoChangeSupportNewDriver(evt, "agreeTandC");   

    ();
  }

  let driverContactOkChangeHandler = evt => {
    driverFormInfoChangeSupportNewDriver(evt, "contactOk");   

    ();
  }

  let driverOrgNameChangeHandler = evt => {
    driverFormInfoChangeSupportNewDriver(evt, "orgName");   

    ();
  }

  let inputTimeStart = (typeName, rowId, startTime, startTimeChangeHandler) => {  
    let xName = typeName ++ "TimeStart";
    let xId = inputId(typeName, rowId, "TimeStart");
    let xEnd = "#" ++ inputId(typeName, rowId, "TimeEnd");

    let time = switch (String.length (startTime) > 0) {
      | true => startTime
      | false => "06:00"
    };

    let f = <input className="form-input input--time-start" type_="time" name=xName id=xId min=6 max="22:00" value=time required=true onChange={startTimeChangeHandler} />;

    let data = [("data-start", xEnd)];

    let x = inputDateSection(f, data);

    x;
  };

  let inputTimeEnd = (typeName, rowId, endTime, endTimeChangeHandler) => {  
    let xName = typeName ++ "TimeEnd";
    let xId = inputId(typeName, rowId, "TimeEnd");
    let xEnd = "#" ++ inputId(typeName, rowId, "TimeStart");

    let time = switch (String.length (endTime) > 0) {
      | true => endTime
      | false => "22:00"
    };

    let f = <input className="form-input input--time-end" type_="time" name=xName id=xId min=6 max="22:00" value=time required=true onChange={endTimeChangeHandler} />;

    let data = [("data-end", xEnd)];

    let x = inputDateSection(f, data);

    x;
  };

  let datePickerRow = (typeName, rowId, dateInfo, dateChangeHandler, startTimeChangeHandler, endTimeChangeHandler) => {

    let inputDateId =  {typeName ++ "Date" ++ rowId};

    let showCloseButton = false;

    /* 
            <div className="form-group calendar-date-block">
                <label htmlFor={inputDateId++"x"}>{ReasonReact.string("Datex")}</label>
                <DateExtra props={dateExtraJsProps} id={inputDateId++"x"} className="form-input input--date" type_="date" name={typeName ++ "Datex"} value=dateInfo->TypeInfo.dateGet required=true onChange={dateChangeHandler} />
                <div className="help-block with-errors"></div>
            </div>    
    */

    let row = <div id="available-time-row">
        <li className="available-times__row">
            <div className="form-group calendar-date-block">
              <label htmlFor=inputDateId>{ReasonReact.string("Date")}</label>
              <input className="form-input input--date" type_="date" name={typeName ++ "Date"} id=inputDateId onChange={dateChangeHandler} value=dateInfo->TypeInfo.dateGet required=true />
                <div className="help-block with-errors"></div>
            </div>
            <div className="form-group">
                <label htmlFor={typeName ++ "TimeStart" ++ rowId}>{ReasonReact.string("Start time")}</label>
                {inputTimeStart(typeName, rowId, dateInfo->TypeInfo.timeStartGet, startTimeChangeHandler)}
                <div className="help-block with-errors"></div>
            </div>
            <div className="form-group">
                <label htmlFor={typeName ++ "TimeEnd" ++ rowId}>{ReasonReact.string("End time")}</label>
                {inputTimeEnd(typeName, rowId, dateInfo->TypeInfo.timeEndGet, endTimeChangeHandler)}
                <div className="help-block with-errors"></div>
            </div>
            {switch (showCloseButton == true) {
            | true => (<button className="remove-time button--cancel" ariaLabel="Delete time">{hmtlTimesEntity}</button>)
            | false => ReasonReact.null
            }}

        </li>
    </div>

    row;
    };

  {
  ...component,
  render: _self => {
    let riderDateInfo = inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.dateInfoGet;

    let driverDateInfo = inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.driverDateInfoGet;
    
    let riderIsoTime = formatAvailabilityPeriod(riderDateInfo->TypeInfo.dateGet, 
    riderDateInfo->TypeInfo.timeStartGet, 
    riderDateInfo->TypeInfo.timeEndGet);

    let driverIsoTime = formatAvailabilityPeriod(driverDateInfo->TypeInfo.dateGet, 
    driverDateInfo->TypeInfo.timeStartGet, 
    driverDateInfo->TypeInfo.timeEndGet);

    let ulRiderTimes = <ul id="RiderAvailableTimes" className="available-times">{datePickerRow(riderTypeName, rowIdAsText, riderDateInfo, riderDateChangeHandler, riderStartTimeChangeHandler, riderEndTimeChangeHandler)}</ul>

    let ulDriverTimes = <ul id="DriverAvailableTimes" className="available-times">{datePickerRow(driverTypeName, rowIdAsText, driverDateInfo, driverDateChangeHandler, driverStartTimeChangeHandler, driverEndTimeChangeHandler)}</ul>

    let ulRiderAvailableTimes = withDataAttributes([("data-type", "Rider")], ulRiderTimes);

    let ulDriverAvailableTimes = withDataAttributes([("data-type", "Driver")], ulDriverTimes);

    let riderEmailPreferredContact =inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.emailPreferredGet;

    let inputRiderPreferredEmailContact = withDataAttributes([("data-emailid", "#riderEmail")], <input className="toggleRequiredEmail" type_="checkbox" name="RiderPreferredContact" value="Email" checked=riderEmailPreferredContact onChange=riderEmailPreferredChangeHandler />);

    let mainDivStyle = ReactDOMRe.Style.make(~marginTop ="150px", ());
    let h2Style = ReactDOMRe.Style.make(~marginTop ="40px", ());

    let testButtonStyle = ReactDOMRe.Style.make(~display ="none", ());
    /* style={testButtonStyle}  */

    let showAddDateButton = false;
    let showCloseFormButton = false;
    let showPollingPlaces = false;

    let inputFormsJSX = 
    <div>
      <h2 style={h2Style}>{ReasonReact.string("Input Forms")}
      </h2>
    <div style={mainDivStyle}>
        <div id="formsX" className="forms wrapper offset-top">
        <form id="need-ride" name="needRide" action={url ++ "/rider"} method="post" className="ride-form-op" ariaHidden=false>
            <input type_="hidden" name="_redirect" className="redirect" value={siteUrl ++ "/thanks-rider/?type_=rider"} />
            <div className="bannerbox">
                <h2 className="bannerbox__title">{ReasonReact.string("I need a ride")}</h2>
                <div className="bannerbox__content">
                    {
                      switch showCloseFormButton {
                        | true =>                     <a className="close-form button--cancel" href="#intro" ariaLabel="Close form" role="button" ariaControls="need-ride">hmtlTimesEntity</a>
                        | false => ReasonReact.null
                      }
                    }
                    
                    <p>{ReasonReact.string("Please enter your details in the form below, and our automatic matching algorithm will use this information to try to find you a driver.")}</p>

                    <fieldset className="rider-select-org">
                        <legend>{ReasonReact.string("Choose your organization")}</legend>

                        <p>{ReasonReact.string("Please choose this carefully as otherwise you may be asked to re-enter your details. Check with your organization if you are not sure.")}</p>

                        <div className="form-column">
                            <div className="form-group">
                                <button id="riderSetTestDateButton" style={testButtonStyle} className="add-time-btn button" onClick={testRiderDateChangeHandler}>{ReasonReact.string("Set Rider Test Date")}</button>                                
                                <button id="driverSetTestDateButton" style={testButtonStyle} className="add-time-btn button" onClick={testDriverDateChangeHandler}>{ReasonReact.string("Set Driver Test Date")}</button>                                
                                <input id="RidingOnBehalfOfOrganization" name="RidingOnBehalfOfOrganization" type_="hidden" value="true" />
                                <label htmlFor="RidingOBOOrganizationName">{ReasonReact.string("Organization name")}</label>
                                <select id="RidingOBOOrganizationName" name="RidingOBOOrganizationName" required=true onChange=riderOrgNameChangeHandler value=inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.orgNameGet >
                                    <option value="None">{ReasonReact.string("None")}</option>
                                    <option value="NAACP">{ReasonReact.string("NAACP")}</option>
                                    <option value="AAPD">{ReasonReact.string("AAPD")}</option>
                                    <option value="PPC">{ReasonReact.string("PPC")}</option>
                                    <option value="MDCC">{ReasonReact.string("MDCC")}</option>
                                    <option value="MarchOn">{ReasonReact.string("MarchOn")}</option>
                                    <option value="CenterCG">{ReasonReact.string("CenterCG")}</option>
                                    <option value="PDAction">{ReasonReact.string("PDAction")}</option>
                                    <option value="DailyKos">{ReasonReact.string("DailyKos")}</option>
                                </select>
                            </div>
                          </div>
                    </fieldset>
                    
                    <fieldset className="date-time-pickers">
                        <legend>{ReasonReact.string("Dates and Times Available")}</legend>

                        <p>{ReasonReact.string("On what dates and times would you be available for the ride? Please pick all the time slots that could work for you: This will make it easier for us to match you with a driver. You can pick multiple time slots, on different dates or on the same date.")}</p>
                        {ulRiderAvailableTimes}
                        {
                          switch showAddDateButton {
                            | true => 
                              <div>
                                <button className="add-time-btn button" ariaControls="RiderAvailableTimes">hmtlPlusEntity{ReasonReact.string(" Add another date / time")}</button>
                                <small>{ReasonReact.string("(Add as many dates and time ranges as you like)")}</small>
                              </div>
                            | false => ReasonReact.null
                          }
                        }
                        <input type_="hidden" className="hiddenJSONTimes" name="AvailableRideTimesJSON" value=riderIsoTime />
                    </fieldset>

                    <fieldset>
                        <legend>{ReasonReact.string("Your location details")}</legend>

                        /* 
                                <input type_="text" className="form-input" id="riderCollectionAddress" placeholder="Your pick up address" name="RiderCollectionAddress" onFocus="autocompleteGeolocate()" required=true />

                                <input type_="text" className="form-input" id="riderDestinationAddress" placeholder="Your destination address" name="RiderDestinationAddress" onFocus="autocompleteGeolocate()" required=true />
                                */

                        <div className="form-column">
                            <div className="form-group">
                                <label htmlFor="riderCollectionAddress">{ReasonReact.string("Pick up address")}</label>
                                <input type_="text" className="form-input" id="riderCollectionAddress" placeholder="Your pick up address" name="RiderCollectionAddress" required=true onChange=riderCollectionAddressChangeHandler value=inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.collectionAddressGet />
                                <div className="help-block with-errors"></div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="rideArea">{ReasonReact.string("Pick up ZIP code")}</label>
                                <input type_="text" className="form-input form-input--medium" pattern=regexPattern id="rideArea" placeholder="Where you can meet the driver" name="RiderCollectionZIP" required=true onChange=riderCollectionZipChangeHandler value=inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.collectionZipGet />
                                <div className="help-block with-errors"></div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="riderDestinationAddress">{ReasonReact.string("Destination address")}</label>
                                <input type_="text" className="form-input" id="riderDestinationAddress" placeholder="Your destination address" name="RiderDestinationAddress" required=true onChange=riderDestinationAddressChangeHandler value=inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.destinationAddressGet />
                                <div className="help-block with-errors"></div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="rideDestinationZIP">{ReasonReact.string("Destination ZIP code")}</label>
                                <input type_="text" className="form-input form-input--medium" pattern=regexPattern id="rideDestinationZIP" name="RiderDropOffZIP" placeholder="To where do you need a ride?" required=true onChange=riderDestinationZipChangeHandler value=inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.destinationZipGet />
                                <div className="help-block with-errors"></div>
                            </div>
                        </div>

                        {
                          switch showPollingPlaces {
                          | true =>                         
                              <div className="form-column">
                                <div className="form-group polling-place">
                                    <label>{ReasonReact.string("Find your polling place")}</label>
                                    <div className="help-block">{ReasonReact.string("(Link will open your state’s polling place checker in a new tab.)")}</div>
                                    <ul id="location-details" className="state-dropdown state-dropdown--large">
                                        <li>{ReasonReact.string("Loading&hellip;")}</li>
                                    </ul>
                                </div>
                              </div>
                          | false => ReasonReact.null
                          }; 
                        }
                    </fieldset>

                    <fieldset>
                        <legend>{ReasonReact.string("Vehicle requirements")}</legend>
                        <div className="form-group">
                            <label htmlFor="rideSeats">{ReasonReact.string("Number of seats required")}</label>
                            <input type_="number" className="form-input form-input--small" id="rideSeats" name="TotalPartySize" min=1 required=true onChange=riderSeatCountChangeHandler value=inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.seatCountGet />
                            <div className="help-block with-errors"></div>
                            <small>{ReasonReact.string("Please let us know how many people will need to travel together in the same car. You may take somebody with you as a safety measure.")}</small>
                            <small>{ReasonReact.string("To make it easier for us to match people, we ask that you travel with as few people as possible.")}</small>
                        </div>
                        <div className="form-group checkbox">
                            <label htmlFor="riderIsPowerChairUser">
                                <input type_="checkbox" name="NeedWheelchair" id="riderIsPowerChairUser" onChange=riderPowerChairUserChangeHandler checked=inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.powerChairUserGet />{ReasonReact.string("I am a powerchair user who needs an adapted van with a lift.")}
                            </label>
                        </div>
                        <div className="form-group checkbox">
                            <label htmlFor="rideReturn">
                                <input type_="checkbox" name="TwoWayTripNeeded" id="rideReturn" onChange=riderTwoWayTripNeededChangeHandler checked=inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.twoWayTripNeededGet /> {ReasonReact.string("I need a two-way trip.")}
                            </label>
                        </div>
                        <div className="form-group form-inline form-inline-other-requirements">
                            <label htmlFor="RiderAccommodationNotes">{ReasonReact.string("Other Requirements")} <i className="optional">{ReasonReact.string("Optional")}</i></label>
                            <textarea className="form-input" id="RiderAccommodationNotes"
                                  placeholder="Please let us know any other requirements you have for your ride..." name="RiderAccommodationNotes" cols=60 rows=6 onChange=riderOtherRequirementsChangeHandler value=inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.otherRequirementsGet ></textarea>
                        </div>
                        <div className="form-inline">
                            <small>{ReasonReact.string("Please let us know of any other accommodation requirements.")}</small>
                            <ul>
                                <li><small>{ReasonReact.string("Service animal")}</small></li>
                                <li><small>{ReasonReact.string("Assistance folding equipment")}</small></li>
                                <li><small>{ReasonReact.string("Assistance entering/ exiting the Vehicle")}</small></li>
                                <li><small>{ReasonReact.string("Child car seat or booster (please include age)")}</small></li>
                                <li><small>{ReasonReact.string("Do not speak English (please include languages)")}</small></li>
                                <li><small>{ReasonReact.string("Other")}</small></li>
                            </ul>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>{ReasonReact.string("Your details")}</legend>

                        <div className="form-group">
                            <label htmlFor="riderFirstName">{ReasonReact.string("First name")}</label>
                            <input type_="text" className="form-input" id="riderFirstName" placeholder="Your first name" name="RiderFirstName" required=true onChange=riderFirstNameChangeHandler value=inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.firstNameGet />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="riderLastName">{ReasonReact.string("Last name")}</label>
                            <input type_="text" className="form-input" id="riderLastName" placeholder="Your last name" name="RiderLastName" required=true onChange=riderLastNameChangeHandler value=inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.lastNameGet />
                            <div className="help-block with-errors"></div>
                        </div> 
                        <div className="form-group">
                            <label htmlFor="riderEmail">{ReasonReact.string("Email address")} 
                            {
                              switch riderEmailPreferredContact {
                              | true => ReasonReact.null
                              | false => <i className="optional"
                              >{ReasonReact.string("Optional")}</i>
                              }
                            }
                            </label>
                            <input type_="email" className="form-input" id="riderEmail" placeholder="Email" name="RiderEmail" onChange=riderEmailChangeHandler value=inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.emailGet required=riderEmailPreferredContact />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="riderPhone">{ReasonReact.string("Phone number (cell preferred)")}</label>
                            <input type_="tel" className="form-input" id="riderPhone" placeholder="Phone" name="RiderPhone" required=true onChange=riderPhoneChangeHandler value=inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.phoneGet />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group radio">
                            <p>{ReasonReact.string("Is this a cell phone?")}</p>
                            <label>
                                <input type_="radio" name="riderCell" value="Yes"
                                onChange=riderCellPhoneChangeHandler  checked={inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.cellPhoneGet==true} 
                                 />{ReasonReact.string("Yes")}
                            </label>
                            <label>
                                <input type_="radio" name="riderCell" value="No" onChange=riderCellPhoneChangeHandler checked={inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.cellPhoneGet==false} />{ReasonReact.string("No")}
                            </label>
                        </div>
                        <div className="form-group checkbox checkbox--multi">
                            <p>{ReasonReact.string("How would you prefer the driver contacts you?")}</p>
                            <label>
                                {inputRiderPreferredEmailContact} {ReasonReact.string("Email")}
                            </label>
                            <label>
                                <input type_="checkbox" name="RiderPreferredContact" value="Phone" checked=inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.phonePreferredGet  onChange=riderPhonePreferredChangeHandler /> {ReasonReact.string("Phone")}
                            </label>
                            <label>
                                <input type_="checkbox" name="RiderPreferredContact" value="SMS" checked=inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.smsPreferredGet onChange=ridersmsPreferredChangeHandler /> {ReasonReact.string("SMS")}
                            </label>
                        </div>
                    </fieldset>

                    <div className="form-group checkbox">
                        <label htmlFor="RiderLegalConsent">
                            <input type_="checkbox" id="RiderLegalConsent" name="RiderLegalConsent" required=true onChange=riderAgreeTandCChangeHandler checked=inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.agreeTandCGet /> {ReasonReact.string("I agree to the")} <a href="terms-conditions/" target="_blank" >{ReasonReact.string("Terms ")}hmtlAmpEntity{ReasonReact.string(" Conditions.")}</a>
                        </label>
                        <small>{ReasonReact.string("I understand that Carpool Vote LLC will share my contact details with the driver if there's a match. (Carpool Vote will not share personal details with anybody else, unless required by law, and will destroy them within three months of election day if you've asked us not to stay in touch.)")}</small>
                        <small>{ReasonReact.string("I understand that Carpool Vote provides introductions between riders and volunteer drivers who have signed up on the platform. I understand that anybody can sign up to drive and Carpool Vote is unable to perform any background checks on people who use the platform. As with any other environment where I meet new people, I will take steps to keep myself and my possessions safe and accept that Carpool Vote cannot be responsible if anything goes wrong.")}</small>
                        <small>{ReasonReact.string("I understand that Carpool Vote cannot guarantee that I will find a ride by using the platform, or that a driver will complete the ride as agreed. In that case, I will keep looking for a ride until I have reached my destination.")}</small>
                        <small>{ReasonReact.string("I understand that this service is open to any driver or rider - no matter what their personal background or beliefs. To help make sure that both the driver and I feel comfortable and safe, I promise that I will not discuss politics during the journey.")}</small>
                    </div>

                    <div className="form-group checkbox">
                        <label htmlFor="inTouchRider">
                            <input type_="checkbox" id="inTouchRider" name="PleaseStayInTouch" onChange=riderContactOkChangeHandler checked=inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.contactOkGet /> {ReasonReact.string("We'd like to keep you updated from time to time about how the project is progressing. Please untick this box if you'd prefer us not to do this.")}
                        </label>
                    </div>
                    <div className="form-group">
                        <button type_="submit" className="button button--large" id="needRideSubmit">{ReasonReact.string("Sign up")}</button>
                        {
                          switch showCloseFormButton {
                            | true => <a className="align-right close-form" href="#intro">{ReasonReact.string("Back")}</a>
                            | false => ReasonReact.null
                          }
                        }
                    </div>
                    <p className="panel-footer"><b>{ReasonReact.string("What happens next?")}</b> {ReasonReact.string("Our system will use these details to automatically try to find you a driver. If there is a match, the driver will get in touch to arrange the ride.")}</p>
                </div>
            </div>
        </form>
        
        <form id="offer-ride" name="offerRide" action={url ++ "/driver"} method="post" className="driver-form-op" ariaHidden=false>
            <input type_="hidden" name="_redirect" className="redirect" value={siteUrl ++ "/thanks-driver/?type_=driver"} />
            <div className="bannerbox">
                <h2 className="bannerbox__title">{ReasonReact.string("I can offer a ride")}</h2>
                <div className="bannerbox__content">
                {
                  switch showCloseFormButton {
                    | true =>
                        <a className="close-form button--cancel" href="#intro" ariaLabel="Close form" role="button" ariaControls="offer-ride">hmtlTimesEntity</a>

                    | false => ReasonReact.null
                  }
                }
                <fieldset className="driver-select-org">
                    <legend>{ReasonReact.string("Choose your organization")}</legend>

                    <p>{ReasonReact.string("Please choose this carefully as otherwise you may be asked to re-enter your details. Check with your organization if you are not sure.")}</p>

                    /*         */

                    <div className="form-column">
                      <div className="form-group">
                        <input id="DrivingOnBehalfOfOrganization" name="DrivingOnBehalfOfOrganization" type_="hidden" value="true" 
                        onChange=driverOrgNameChangeHandler />
                        <label htmlFor="DrivingOBOOrganizationName">{ReasonReact.string("Organization name")}</label>
                        <select id="DrivingOBOOrganizationName" name="DrivingOBOOrganizationName" required=true
                        onChange=driverOrgNameChangeHandler
                        value=inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.dorgNameGet
                        >
                            <option value="None">{ReasonReact.string("None")}</option>
                            <option value="NAACP">{ReasonReact.string("NAACP")}</option>
                            <option value="AAPD">{ReasonReact.string("AAPD")}</option>
                            <option value="PPC">{ReasonReact.string("PPC")}</option>
                            <option value="MDCC">{ReasonReact.string("MDCC")}</option>
                            <option value="MarchOn">{ReasonReact.string("MarchOn")}</option>
                            <option value="CenterCG">{ReasonReact.string("CenterCG")}</option>
                            <option value="PDAction">{ReasonReact.string("PDAction")}</option>
                            <option value="DailyKos">{ReasonReact.string("DailyKos")}</option>
                        </select>  
                    </div>
                  </div>
                </fieldset>
                        
                    <fieldset className="date-time-pickers">
                        <legend>{ReasonReact.string("What can you offer?")}</legend>

                        <h3>{ReasonReact.string("Dates and times available")}</h3>
                        <p>{ReasonReact.string("On what dates and times would you be a available to give rides? Please pick all the time slots that could work for you: This will make it easier for us to match you with someone who needs a ride. You can pick multiple time slots, on different dates or on the same date.")}</p>
                        ulDriverAvailableTimes    
                        {
                          switch showAddDateButton {
                            | true => 
                                <div> 
                                  <button className="add-time-btn button" ariaControls="DriverAvailableTimes">hmtlPlusEntity{ReasonReact.string(" Add another date / time")}</button>
                                  <small>{ReasonReact.string("(Add as many dates and time ranges as you like)")}</small>
                                </div>
                            | false => ReasonReact.null
                          }
                        }
                        <input type_="hidden" className="hiddenJSONTimes" name="AvailableDriveTimesJSON" value=driverIsoTime />
                    </fieldset>

                    <fieldset>
                        <legend>{ReasonReact.string("Location and vehicle")}</legend>

                        <div className="form-group">
                            <label htmlFor="rideArea">{ReasonReact.string("Driving ZIP code")}</label>
                            <input type_="text" className="form-input form-input--medium" pattern=regexPattern id="offerArea" placeholder="Where can you pick up the rider?" name="DriverCollectionZIP" required=true 
                            value=inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.driverZipGet onChange=driverZipChangeHandler />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group">
                            <p>{ReasonReact.string("I am willing to collect within a")} 
                            <input type_="number" id="offerMiles" name="DriverCollectionRadius" min=0 step=1.0 className="form-input form-input--inline" placeholder="e.g. 10" required=true                             value=inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.driverRadiusGet onChange=driverRadiusChangeHandler />
                            {ReasonReact.string("mile radius of this zip code.")}
                            </p>
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="driverSeats">{ReasonReact.string("Passenger seats available in vehicle")}</label>
                            <input type_="number" min=0 className="form-input form-input--small" id="driverSeats" name="SeatCount" placeholder="e.g. 2" required=true        value=inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.seatsAvailableGet onChange=driverSeatsAvailableChangeHandler />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group checkbox">
                            <label htmlFor="driverWheelchair">
                                <input type_="checkbox" name="DriverCanLoadRiderWithWheelchair" id="driverWheelchair" 
                                checked=inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.powerChairSupportGet onChange=driverPowerchairSupportChangeHandler /> {ReasonReact.string("I have an adapted van with space for a powerchair")}
                            </label>
                        </div>
                        <div className="form-group checkbox">
                            <label htmlFor="offerInsurance">
                                <input type_="checkbox" name="DriverHasInsurance" id="offerInsurance" required=true checked=inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.hasInsuranceGet onChange=driverHasInsuranceChangeHandler /> {ReasonReact.string("I confirm the driver has insurance")}
                            </label>
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="driverLicence">{ReasonReact.string("Vehicle licence plate number")}</label>
                            <input type_="text" className="form-input form-input--medium" id="driverLicence" name="DriverLicenceNumber" required=true value=inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.licenceNumberGet onChange=driverLicenceNumberChangeHandler />
                            <div className="help-block with-errors"></div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>{ReasonReact.string("Your details")}</legend>

                        <div className="form-group">
                            <label htmlFor="driverFirstName">{ReasonReact.string("First name")}</label>
                            <input type_="text" className="form-input" id="driverFirstName" placeholder="Your first name" name="DriverFirstName" required=true value=inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.dfirstNameGet onChange=driverFirstNameChangeHandler />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="driverLastName">{ReasonReact.string("Last name")}</label>
                            <input type_="text" className="form-input" id="driverLastName" placeholder="Your last name" name="DriverLastName" required=true value=inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.dlastNameGet onChange=driverLastNameChangeHandler />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="driverEmail">{ReasonReact.string("Email address")}</label>
                            <input type_="email" className="form-input" id="driverEmail" placeholder="Email address" name="DriverEmail" required=true value=inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.demailGet onChange=driverEmailChangeHandler />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="driverPhone">{ReasonReact.string("Cell phone number")}</label>
                            <input type_="tel" className="form-input" id="driverPhone" placeholder="Phone" name="DriverPhone" required=true value=inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.dphoneGet onChange=driverPhoneChangeHandler />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group checkbox checkbox--multi">
                            <p>{ReasonReact.string("Preferred notification method (choose as many as you like)")}</p>
                            <label>
                                <input type_="checkbox" name="DriverPreferredContact" value="Email" 
                                checked=inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.demailPreferredGet onChange=driverEmailPreferredChangeHandler /> {ReasonReact.string("Email")}
                            </label>
                            <label>
                                <input type_="checkbox" name="DriverPreferredContact" value="SMS"                           checked=inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.dsmsPreferredGet onChange=driversmsPreferredChangeHandler /> {ReasonReact.string("SMS")}
                            </label>
                        </div>
                    </fieldset>

                    <div className="form-group checkbox">
                        <label htmlFor="DriverAgreeTnC">
                            <input type_="checkbox" id="DriverAgreeTnC" name="DriverAgreeTnC" required=true 
                            checked=inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.dagreeTandCGet  onChange=driverAgreeTandCChangeHandler /> {ReasonReact.string("I agree to the")} <a href="terms-conditions/" target="_blank">{ReasonReact.string("Terms ")}hmtlAmpEntity{ReasonReact.string(" Conditions.")}</a>
                        </label>
                        <small>{ReasonReact.string("I understand that Carpool Vote LLC will share my contact details with the driver if there's a match. (Carpool Vote will not share personal details with anybody else, unless required by law, and will destroy them within three months of election day if you've asked us not to stay in touch.)")}</small>
                        <small>{ReasonReact.string("I understand that Carpool Vote provides introductions between riders and volunteer drivers who have signed up on the platform. I understand that anybody can sign up to drive and Carpool Vote is unable to perform any background checks on people who use the platform. As with any other environment where I meet new people, I will take steps to keep myself and my possessions safe and accept that Carpool Vote LLC cannot be responsible if anything goes wrong.")}</small>
                        <small>{ReasonReact.string("I understand that Carpool Vote cannot guarantee that I will find appropriate matches through the platform, or that any agreed ride will occur. I take full responsibility for any cost related to using the platform.")}</small>
                        <small>{ReasonReact.string("I understand that this service is open to any driver or rider - no matter what their personal background or beliefs. To help make sure that both the driver and I feel comfortable and safe, I promise that I will not discuss politics during the journey.")}</small>
                    </div>
                    <div className="form-group checkbox">
                        <label htmlFor="inTouchDriver">
                            <input type_="checkbox" id="inTouchDriver" name="PleaseStayInTouch"      checked=inputFormsInfo->TypeInfo.driverInfoGet->TypeInfo.dcontactOkGet   onChange=driverContactOkChangeHandler /> {ReasonReact.string("We'd like to keep you updated from time to time about how the project is progressing. Please untick this box if you'd prefer us not to do this.")}
                        </label>
                    </div>
                    <div className="form-group">
                        <button type_="submit" className="button button--large" id="offerRideSubmit">{ReasonReact.string("Sign up")}</button>
                        {
                          switch showCloseFormButton {
                            | true =>
                                <a className="align-right close-form" href="#intro">{ReasonReact.string("Back")}</a>
                            | false => ReasonReact.null
                          }
                        }
                    </div>
                    <p className="panel-footer"><b>{ReasonReact.string("What happens next?")}</b> {ReasonReact.string("Our system will use these details to try to find riders. If there is a potential match, we'll send you a notification. If you accept the match, we'll let the rider know that you'll be in touch to arrange the ride.")}</p>
              </div>
            </div>
        </form>
    </div>
    </div>
  </div>;

  let display = switch (loginInfo->TypeInfo.loggedInGet) {
  | true => inputFormsJSX
  | false => ReasonReact.null
  };

  display;
  },
}};

let default = ReasonReact.wrapReasonForJs(~component, 
jsProps => make(~loginInfo=jsProps->loginInfoGet, ~apiInfo=jsProps->apiInfoGet, 
~inputFormsInfo=jsProps->inputFormsInfoGet,
~setDriverDateInfo=jsProps->setDriverDateInfoGet,
~setDriverFormInfo=jsProps->setDriverFormInfoGet,
~setRiderDateInfo=jsProps->setRiderDateInfoGet,
~setRiderFormInfo=jsProps->setRiderFormInfoGet,
[||]));
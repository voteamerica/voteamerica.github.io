let component = ReasonReact.statelessComponent("InputForms");

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

  /* [@bs.deriving abstract]
  type xinputFormsDateInfo = {
    xdate: string,
  }; */

let make = (~loginInfo:TypeInfo.loginInfo, 
    ~apiInfo:TypeInfo.apiInfo, 
    ~inputFormsInfo: TypeInfo.inputFormsInfo, 
    ~setDriverDateInfo,
    ~setDriverFormInfo,
    ~setRiderDateInfo,
    ~setRiderFormInfo,
    _children) => {
  let typeName = "Rider";
  let rowId = string_of_int(0);
      
  /* https://stackoverflow.com/questions/49039433/how-to-add-a-copyright-symbol-in-reason-react-component */
  let hmtlPlusEntity = <span dangerouslySetInnerHTML={{ "__html": "&plus;" }}></span>;
  let hmtlTimesEntity = <span dangerouslySetInnerHTML={{ "__html": "&times;" }}></span>;
  let hmtlAmpEntity = <span dangerouslySetInnerHTML={{ "__html": "&amp;" }}></span>;

  let regexPattern="(^\\d{5}$)|(^\\d{5}-\\d{4}$)";

  let withDataAttributes = (data, element) => ReasonReact.cloneElement(element, ~props=Obj.magic(Js.Dict.fromList(data)), [||]);
    
  let inputDateSection = (fragment, data) => withDataAttributes(data, fragment);

  let inputId = (typeName, rowId, sectionName) => typeName ++ sectionName ++ rowId;

  /* let inputMonth = (typeName, rowId) => {  
    let xId = inputId(typeName, rowId, "Month");
    
    let f = <input className="form-input form-input--tiny input--month" type_="number" id=xId placeholder="MM" min=1 max="12" required=true />;

    let data = [("data-field", "month")];

    let x = inputDateSection(f, data);

    x;
  };

  let inputDay = (typeName, rowId) =>{  
    let xId = inputId(typeName, rowId, "Day");

    let f = <input className="form-input form-input--tiny input--day" type_="number" id=xId placeholder="DD" min=1 max="31" required=true />;

    let data = [("data-field", "day")];

    let x = inputDateSection(f, data);

    x;
  }; */

  /* let inputYear = (typeName, rowId) => {  
    let xId = inputId(typeName, rowId, "Year");

    let f = <input className="form-input form-input--tiny input--year" type_="number" id=xId placeholder="YYYY" min=2017 required=true />;

    let data = [("data-field", "year")];

    let x = inputDateSection(f, data);

    x;
  }; */

  /* let inputDate = (typeName, rowId) => {  
    let xId = inputId(typeName, rowId, "Date");
    let xName = typeName ++ "Date"

    let f = <input type_="hidden" id=xId className="input--date" name=xName />
;
    f;
  }; */

    /* let dateFieldFallback = <div className="form-group text-date-block">
        <label htmlFor=inputDateId>{ReasonReact.string("Date")}</label>
        {inputMonth(typeName, rowId)}
        {inputDay(typeName, rowId)}
        {inputYear(typeName, rowId)}
        {inputDate(typeName, rowId)}
        <div className="help-block with-errors"></div>
      </div>; */

  /* NOTE: without this step, dispatch prop does not work correctly - best to use typed version of bs raw section, in part because dispatch prop is optimised out of the function if not referenced in some way */
  let srdi: ((int, TypeInfo.inputFormsDateInfo) => unit, int, TypeInfo.inputFormsDateInfo) => unit = [%raw (fx, index, dateInfo) => "{ fx(index, dateInfo); return 0; }"];

  let riderDateChangeHandler = evt => {
    Js.log(evt);

    let rawDate = ReactEvent.Form.target(evt)##value;

    let parts = Js.String.split("-", rawDate);

    Js.log(parts);

    let riderInfo:TypeInfo.inputFormsInfoRiderInfo = inputFormsInfo->TypeInfo.riderInfoGet;

    Js.log(riderInfo);

    let dateInfo:TypeInfo.inputFormsDateInfo = riderInfo->TypeInfo.dateInfoGet;
    
    /* let newDateInfo = TypeInfo.inputFormsDateInfo(~date=rawDate,
     ~timeStart=dateInfo->TypeInfo.timeStartGet, 
     ~timeEnd=dateInfo->TypeInfo.timeEndGet); */

    let newDateInfo = dateInfo;

    newDateInfo->TypeInfo.dateSet(rawDate);

  /* let x = {
    xdate: "X"
  }; */

  /* let target = [%obj { a = 1; b = 1; }];
  let source = [%obj { b = 2; }];

  let obj = Js.Obj.assign target source */

  /* let x = xinputFormsDateInfo(~xdate="x"); */

  /* let obj = Js.Obj.assign x {xdate:1}  */

     /* let ndi:xinputFormsDateInfo = {...x, xdate: "xx"}; */

    Js.log(riderInfo);

    let index = 0;

    srdi(setRiderDateInfo, index, newDateInfo);

    ();
  }

  let riderStartTimeChangeHandler = evt => {
    /* TypeInfo.unitArgAction(hideExpiredRidersList); */

    Js.log(evt);

    let rawTime = ReactEvent.Form.target(evt)##value;

    /* let parts = Js.String.split("-", rawDate); */
    /* Js.log(parts); */
    Js.log(rawTime);

    let riderInfo = inputFormsInfo->TypeInfo.riderInfoGet;
    let dateInfo = inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.dateInfoGet;

    /* let newDateInfo = TypeInfo.inputFormsDateInfo(~date=dateInfo->TypeInfo.dateGet,
     ~timeStart=rawTime, 
     ~timeEnd=dateInfo->TypeInfo.timeEndGet) */

    let newDateInfo = dateInfo;
    newDateInfo->TypeInfo.timeStartSet(rawTime);

    Js.log(riderInfo);

    let index = 0;

    srdi(setRiderDateInfo, index, newDateInfo);

    ();
  }

  let riderEndTimeChangeHandler = evt => {
    /* TypeInfo.unitArgAction(hideExpiredRidersList); */

    Js.log(evt);

    let rawTime = ReactEvent.Form.target(evt)##value;
    Js.log(rawTime);

    let dateInfo = inputFormsInfo->TypeInfo.riderInfoGet->TypeInfo.dateInfoGet;

    /* let newDateInfo = TypeInfo.inputFormsDateInfo(~date=dateInfo->TypeInfo.dateGet,
     ~timeStart=dateInfo->TypeInfo.timeStartGet, 
     ~timeEnd=rawTime) */
     let newDateInfo = dateInfo;
     newDateInfo->TypeInfo.timeEndSet(rawTime);

    let index = 0;

    srdi(setRiderDateInfo, index, newDateInfo);

    ();
  }

  let riderFormInfoChangeSupport = (evt) => {
    let changeText = ReactEvent.Form.target(evt)##value;

    let riderInfo = inputFormsInfo->TypeInfo.riderInfoGet;
    let newRiderInfo = TypeInfo.inputFormsInfoRiderInfo(        
                        ~startDateChanged=riderInfo->TypeInfo.startDateChanged,
                        ~pickUpAddress=riderInfo->TypeInfo.pickUpAddress,
                        ~dateInfo=riderInfo->TypeInfo.dateInfo,
                        ~collectionAddress=riderInfo->TypeInfo.collectionAddress,
                        ~collectionZip=riderInfo->TypeInfo.collectionZip,
                        ~destinationAddress=riderInfo->TypeInfo.destinationAddress,
                        ~destinationZip=riderInfo->TypeInfo.destinationZip,
                        ~seatCount=riderInfo->TypeInfo.seatCount,
                        ~powerChairUser=riderInfo->TypeInfo.powerChairUser,
                        ~twoWayTripNeeded=riderInfo->TypeInfo.twoWayTripNeeded,
                        ~otherRequirements=riderInfo->TypeInfo.otherRequirements,
                        ~firstName=riderInfo->TypeInfo.firstName,
                        ~lastName=riderInfo->TypeInfo.lastName,
                        ~email=riderInfo->TypeInfo.email,
                        ~phone=riderInfo->TypeInfo.phone,
                        ~cellPhone=riderInfo->TypeInfo.cellPhone,
                        ~emailPreferred=riderInfo->TypeInfo.emailPreferred,
                        ~phonePreferred=riderInfo->TypeInfo.phonePreferred,
                        ~smsPreferred=riderInfo->TypeInfo.smsPreferred,
                        ~agreeTandC=riderInfo->TypeInfo.agreeTandC,
                        ~contactOk=riderInfo->TypeInfo.contactOk,
                        ~orgName=riderInfo->TypeInfo.orgName,
                        );
    /* Js.log(newRiderInfo) */

    /* let n = {...riderInfo, TypeInfo.startDateChanged:false} */

      /* let target = [%obj { a = 1; b = 1; }]; */
      /* let target = [%obj {  }]; */
  /* let source = [%obj {  }]; */

  /* let obj = Js.Obj.assign target source */
  /* let obj = Js.Obj.assign target riderInfo */

  /* let obj = [%obj { a = 1 }] */

/* let copy = Js.Obj.assign (Js.Obj.empty ()) riderInfo */
/* let em =  Js.Obj.empty ();

Js.log("em");
Js.log(em);
Js.log(Js.Obj.assign);
let xx = Js.Obj.assign(em, em); */
/* let xxa = Js.Obj.assign(em, newRiderInfo); */
/* let copy = Js.Obj.assign () */
/* Js.Obj.empty ()) */
/* Js.log(xx); */
    
    (changeText, newRiderInfo);
  }

  
  /* NOTE: without this step, dispatch prop does not work correctly - best to use typed version of bs raw section, in part because dispatch prop is optimised out of the function if not referenced in some way */
  let srfi: ((TypeInfo.inputFormsInfoRiderInfo) => unit, TypeInfo.inputFormsInfoRiderInfo) => unit = [%raw (fx, formInfo) => "{ fx(formInfo); return 0; }"];

  let riderCollectionAddressChangeHandler = evt => {
    Js.log(evt);

    let address = ReactEvent.Form.target(evt)##value;

    let riderInfo = inputFormsInfo->TypeInfo.riderInfoGet;
    let newRiderInfo = riderInfo;
    
    newRiderInfo->TypeInfo.collectionAddressSet(address);

    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let riderCollectionZipChangeHandler = evt => {
    let (address, newRiderInfo) = riderFormInfoChangeSupport(evt);   
    newRiderInfo->TypeInfo.collectionZipSet(address);
    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let riderDestinationAddressChangeHandler = evt => {
    Js.log(evt);

    let (address, newRiderInfo) = riderFormInfoChangeSupport(evt);
    
    newRiderInfo->TypeInfo.destinationAddressSet(address);

    Js.log("rider info")
    Js.log(inputFormsInfo->TypeInfo.riderInfoGet)
    Js.log("new rider info")
    Js.log(newRiderInfo);

    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let riderDestinationZipChangeHandler = evt => {
    let (address, newRiderInfo) = riderFormInfoChangeSupport(evt);   
    newRiderInfo->TypeInfo.destinationZipSet(address);
    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let riderSeatCountChangeHandler = evt => {
    let (address, newRiderInfo) = riderFormInfoChangeSupport(evt);   
    newRiderInfo->TypeInfo.seatCountSet(address);
    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let riderPowerChairUserChangeHandler = evt => {
    let (address, newRiderInfo) = riderFormInfoChangeSupport(evt);   
    newRiderInfo->TypeInfo.powerChairUserSet(address);
    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let riderTwoWayTripNeededChangeHandler = evt => {
    let (address, newRiderInfo) = riderFormInfoChangeSupport(evt);   
    newRiderInfo->TypeInfo.twoWayTripNeededSet(address);
    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let riderOtherRequirementsChangeHandler = evt => {
    let (address, newRiderInfo) = riderFormInfoChangeSupport(evt);   
    newRiderInfo->TypeInfo.otherRequirementsSet(address);
    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let riderFirstNameChangeHandler = evt => {
    let (address, newRiderInfo) = riderFormInfoChangeSupport(evt);   
    newRiderInfo->TypeInfo.firstNameSet(address);
    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let riderLastNameChangeHandler = evt => {
    let (address, newRiderInfo) = riderFormInfoChangeSupport(evt);   
    newRiderInfo->TypeInfo.lastNameSet(address);
    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let riderEmailChangeHandler = evt => {
    let (address, newRiderInfo) = riderFormInfoChangeSupport(evt);   
    newRiderInfo->TypeInfo.emailSet(address);
    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let riderPhoneChangeHandler = evt => {
    let (address, newRiderInfo) = riderFormInfoChangeSupport(evt);   
    newRiderInfo->TypeInfo.phoneSet(address);
    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let riderCellPhoneChangeHandler = evt => {
    let (address, newRiderInfo) = riderFormInfoChangeSupport(evt);   
    newRiderInfo->TypeInfo.cellPhoneSet(address);
    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let riderEmailPreferredChangeHandler = evt => {
    let (address, newRiderInfo) = riderFormInfoChangeSupport(evt);   
    newRiderInfo->TypeInfo.emailPreferredSet(address);
    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let riderPhonePreferredChangeHandler = evt => {
    let (address, newRiderInfo) = riderFormInfoChangeSupport(evt);   
    newRiderInfo->TypeInfo.phonePreferredSet(address);
    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let ridersmsPreferredChangeHandler = evt => {
    let (address, newRiderInfo) = riderFormInfoChangeSupport(evt);   
    newRiderInfo->TypeInfo.smsPreferredSet(address);
    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let riderAgreeTandCChangeHandler = evt => {
    let (address, newRiderInfo) = riderFormInfoChangeSupport(evt);   
    newRiderInfo->TypeInfo.agreeTandCSet(address);
    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let riderContactOkChangeHandler = evt => {
    let (address, newRiderInfo) = riderFormInfoChangeSupport(evt);   
    newRiderInfo->TypeInfo.contactOkSet(address);
    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let riderOrgNameChangeHandler = evt => {
    let (address, newRiderInfo) = riderFormInfoChangeSupport(evt);   
    newRiderInfo->TypeInfo.orgNameSet(address);
    srfi(setRiderFormInfo, newRiderInfo);

    ();
  }

  let inputTimeStart = (typeName, rowId, startTime) => {  
    let xName = typeName ++ "TimeStart";
    let xId = inputId(typeName, rowId, "TimeStart");
    let xEnd = "#" ++ inputId(typeName, rowId, "TimeEnd");

    let time = switch (String.length (startTime) > 0) {
      | true => startTime
      | false => "06:00"
    };

    let f = <input className="form-input input--time-start" type_="time" name=xName id=xId min=6 max="22:00" value=time required=true onChange={riderStartTimeChangeHandler} />;

    let data = [("data-start", xEnd)];

    let x = inputDateSection(f, data);

    x;
  };

  let inputTimeEnd = (typeName, rowId, endTime) => {  
    let xName = typeName ++ "TimeEnd";
    let xId = inputId(typeName, rowId, "TimeEnd");
    let xEnd = "#" ++ inputId(typeName, rowId, "TimeStart");

    let time = switch (String.length (endTime) > 0) {
      | true => endTime
      | false => "22:00"
    };

    let f = <input className="form-input input--time-end" type_="time" name=xName id=xId min=6 max="22:00" value=time required=true onChange={riderEndTimeChangeHandler} />;

    let data = [("data-end", xEnd)];

    let x = inputDateSection(f, data);

    x;
  };

  let datePickerRow = (typeName, rowId, dateInfo) => {

    let inputDateId =  {typeName ++ "Date" ++ rowId};

    let dateValue = dateInfo->TypeInfo.dateGet;

    let showCloseButton = false;

    let row = <div id="available-time-row">
        <li className="available-times__row">
            <div className="form-group calendar-date-block">
                <label htmlFor=inputDateId>{ReasonReact.string("Date")}</label>
              <input className="form-input input--date" type_="date" name={typeName ++ "Date"} id=inputDateId onChange={riderDateChangeHandler} value=dateValue required=true />
                <div className="help-block with-errors"></div>
            </div>
            <div className="form-group">
                <label htmlFor={typeName ++ "TimeStart" ++ rowId}>{ReasonReact.string("Start time")}</label>
                {inputTimeStart(typeName, rowId, dateInfo->TypeInfo.timeStart)}
                <div className="help-block with-errors"></div>
            </div>
            <div className="form-group">
                <label htmlFor={typeName ++ "TimeEnd" ++ rowId}>{ReasonReact.string("End time")}</label>
                {inputTimeEnd(typeName, rowId, dateInfo->TypeInfo.timeEnd)}
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
    
    let ulRiderTimes = <ul id="RiderAvailableTimes" className="available-times">{datePickerRow(typeName, rowId, riderDateInfo)}</ul>

    let ulRiderAvailableTimes = withDataAttributes([("data-type", "Rider")], ulRiderTimes);

    let ulDriverAvailableTimes = withDataAttributes([("data-type", "Driver")], <ul id="DriverAvailableTimes" className="available-times" />);

    let inputRiderPreferredEmailContact = withDataAttributes([("data-emailID", "#riderEmail")], <input className="toggleRequiredEmail" type_="checkbox" name="RiderPreferredContact" value="Email" onChange=riderEmailPreferredChangeHandler />);

    /*
        <div id="forms" className="forms wrapper offset-top">
        <form id="need-ride" name="needRide" action="{{ api }}/rider" method="post" className="ride-form" ariaHidden=true>
    */

    let mainDivStyle = ReactDOMRe.Style.make(~marginTop ="150px", ());

    <div> {ReasonReact.string("Input Forms")}
    <div style={mainDivStyle}>
        <div id="formsX" className="forms wrapper offset-top">
        <form id="need-ride" name="needRide" action="{{ api }}/rider" method="post" className="ride-form-op" ariaHidden=false>
            <input type_="hidden" name="_redirect" className="redirect" value="{{ cp_site }}/thanks-rider/?type_=rider" />
            <div className="bannerbox">
                <h2 className="bannerbox__title">{ReasonReact.string("I need a ride")}</h2>
                <div className="bannerbox__content">
                    <a className="close-form button--cancel" href="#intro" ariaLabel="Close form" role="button" ariaControls="need-ride">hmtlTimesEntity</a>

                    <p>{ReasonReact.string("Please enter your details in the form below, and our automatic matching algorithm will use this information to try to find you a driver.")}</p>

                    <fieldset className="rider-select-org">
                        <legend>{ReasonReact.string("Choose your organization")}</legend>

                        <p>{ReasonReact.string("Please choose this carefully as otherwise you may be asked to re-enter your details. Check with your organization if you are not sure.")}</p>

                        <div className="form-column">
                            <div className="form-group">
                                <input id="RidingOnBehalfOfOrganization" name="RidingOnBehalfOfOrganization" type_="hidden" value="true" />
                                <label htmlFor="RidingOBOOrganizationName">{ReasonReact.string("Organization name")}</label>
                                <select id="RidingOBOOrganizationName" name="RidingOBOOrganizationName" required=true onChange=riderOrgNameChangeHandler >
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
                        ulRiderAvailableTimes
                        <button className="add-time-btn button" ariaControls="RiderAvailableTimes">hmtlPlusEntity{ReasonReact.string(" Add another date / time")}</button>
                        <small>{ReasonReact.string("(Add as many dates and time ranges as you like)")}</small>
                        <input type_="hidden" className="hiddenJSONTimes" name="AvailableRideTimesJSON" />
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
                                <input type_="text" className="form-input" id="riderCollectionAddress" placeholder="Your pick up address" name="RiderCollectionAddress" required=true onChange=riderCollectionAddressChangeHandler value=inputFormsInfo->TypeInfo.riderInfo->TypeInfo.collectionAddressGet />
                                <div className="help-block with-errors"></div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="rideArea">{ReasonReact.string("Pick up ZIP code")}</label>
                                <input type_="text" className="form-input form-input--medium" pattern=regexPattern id="rideArea" placeholder="Where you can meet the driver" name="RiderCollectionZIP" required=true onChange=riderCollectionZipChangeHandler />
                                <div className="help-block with-errors"></div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="riderDestinationAddress">{ReasonReact.string("Destination address")}</label>
                                <input type_="text" className="form-input" id="riderDestinationAddress" placeholder="Your destination address" name="RiderDestinationAddress" required=true onChange=riderDestinationAddressChangeHandler value=inputFormsInfo->TypeInfo.riderInfo->TypeInfo.destinationAddressGet />
                                <div className="help-block with-errors"></div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="rideDestinationZIP">{ReasonReact.string("Destination ZIP code")}</label>
                                <input type_="text" className="form-input form-input--medium" pattern=regexPattern id="rideDestinationZIP" name="RiderDropOffZIP" placeholder="To where do you need a ride?" required=true onChange=riderDestinationZipChangeHandler />
                                <div className="help-block with-errors"></div>
                            </div>
                        </div>

                        <div className="form-column">
                            <div className="form-group polling-place">
                                <label>{ReasonReact.string("Find your polling place")}</label>
                                <div className="help-block">{ReasonReact.string("(Link will open your state’s polling place checker in a new tab.)")}</div>
                                <ul id="location-details" className="state-dropdown state-dropdown--large">
                                    <li>{ReasonReact.string("Loading&hellip;")}</li>
                                </ul>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>{ReasonReact.string("Vehicle requirements")}</legend>
                        <div className="form-group">
                            <label htmlFor="rideSeats">{ReasonReact.string("Number of seats required")}</label>
                            <input type_="number" className="form-input form-input--small" id="rideSeats" name="TotalPartySize" min=1 required=true onChange=riderSeatCountChangeHandler />
                            <div className="help-block with-errors"></div>
                            <small>{ReasonReact.string("Please let us know how many people will need to travel together in the same car. You may take somebody with you as a safety measure.")}</small>
                            <small>{ReasonReact.string("To make it easier for us to match people, we ask that you travel with as few people as possible.")}</small>
                        </div>
                        <div className="form-group checkbox">
                            <label htmlFor="riderIsPowerChairUser">
                                <input type_="checkbox" name="NeedWheelchair" id="riderIsPowerChairUser" onChange=riderPowerChairUserChangeHandler />{ReasonReact.string("I am a powerchair user who needs an adapted van with a lift.")}
                            </label>
                        </div>
                        <div className="form-group checkbox">
                            <label htmlFor="rideReturn">
                                <input type_="checkbox" name="TwoWayTripNeeded" id="rideReturn" onChange=riderTwoWayTripNeededChangeHandler /> {ReasonReact.string("I need a two-way trip.")}
                            </label>
                        </div>
                        <div className="form-group form-inline form-inline-other-requirements">
                            <label htmlFor="RiderAccommodationNotes">{ReasonReact.string("Other Requirements")} <i className="optional">{ReasonReact.string("Optional")}</i></label>
                            <textarea className="form-input" id="RiderAccommodationNotes"
                                  placeholder="Please let us know any other requirements you have for your ride..." name="RiderAccommodationNotes" cols=60 rows=6 onChange=riderOtherRequirementsChangeHandler ></textarea>
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
                            <input type_="text" className="form-input" id="riderFirstName" placeholder="Your first name" name="RiderFirstName" required=true onChange=riderFirstNameChangeHandler />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="riderLastName">{ReasonReact.string("Last name")}</label>
                            <input type_="text" className="form-input" id="riderLastName" placeholder="Your last name" name="RiderLastName" required=true onChange=riderLastNameChangeHandler />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="riderEmail">{ReasonReact.string("Email address")} <i className="optional">{ReasonReact.string("Optional")}</i></label>
                            <input type_="email" className="form-input" id="riderEmail" placeholder="Email" name="RiderEmail" onChange=riderEmailChangeHandler />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="riderPhone">{ReasonReact.string("Phone number (cell preferred)")}</label>
                            <input type_="tel" className="form-input" id="riderPhone" placeholder="Phone" name="RiderPhone" required=true onChange=riderPhoneChangeHandler />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group radio">
                            <p>{ReasonReact.string("Is this a cell phone?")}</p>
                            <label>
                                <input type_="radio" name="riderCell" value="Yes" onChange=riderCellPhoneChangeHandler />{ReasonReact.string("Yes")}
                            </label>
                            <label>
                                <input type_="radio" name="riderCell" value="No" onChange=riderCellPhoneChangeHandler />{ReasonReact.string("No")}
                            </label>
                        </div>
                        <div className="form-group checkbox checkbox--multi">
                            <p>{ReasonReact.string("How would you prefer the driver contacts you?")}</p>
                            <label>
                                {inputRiderPreferredEmailContact} {ReasonReact.string("Email")}
                            </label>
                            <label>
                                <input type_="checkbox" name="RiderPreferredContact" value="Phone" onChange=riderPhonePreferredChangeHandler /> {ReasonReact.string("Phone")}
                            </label>
                            <label>
                                <input type_="checkbox" name="RiderPreferredContact" value="SMS" onChange=ridersmsPreferredChangeHandler /> {ReasonReact.string("SMS")}
                            </label>
                        </div>
                    </fieldset>

                    <div className="form-group checkbox">
                        <label htmlFor="RiderAgreeTnC">
                            <input type_="checkbox" id="RiderAgreeTnC" name="RiderAgreeTnC" required=true onChange=riderAgreeTandCChangeHandler /> {ReasonReact.string("I agree to the")} <a href="terms-conditions/" target="_blank" >{ReasonReact.string("Terms ")}hmtlAmpEntity{ReasonReact.string(" Conditions.")}</a>
                        </label>
                        <small>{ReasonReact.string("I understand that Carpool Vote LLC will share my contact details with the driver if there's a match. (Carpool Vote will not share personal details with anybody else, unless required by law, and will destroy them within three months of election day if you've asked us not to stay in touch.)")}</small>
                        <small>{ReasonReact.string("I understand that Carpool Vote provides introductions between riders and volunteer drivers who have signed up on the platform. I understand that anybody can sign up to drive and Carpool Vote is unable to perform any background checks on people who use the platform. As with any other environment where I meet new people, I will take steps to keep myself and my possessions safe and accept that Carpool Vote cannot be responsible if anything goes wrong.")}</small>
                        <small>{ReasonReact.string("I understand that Carpool Vote cannot guarantee that I will find a ride by using the platform, or that a driver will complete the ride as agreed. In that case, I will keep looking for a ride until I have reached my destination.")}</small>
                        <small>{ReasonReact.string("I understand that this service is open to any driver or rider - no matter what their personal background or beliefs. To help make sure that both the driver and I feel comfortable and safe, I promise that I will not discuss politics during the journey.")}</small>
                    </div>

                    <div className="form-group checkbox">
                        <label htmlFor="inTouchRider">
                            <input type_="checkbox" id="inTouchRider" name="PleaseStayInTouch" checked=true onChange=riderContactOkChangeHandler /> {ReasonReact.string("We'd like to keep you updated from time to time about how the project is progressing. Please untick this box if you'd prefer us not to do this.")}
                        </label>
                    </div>
                    <div className="form-group">
                        <button type_="submit" className="button button--large" id="needRideSubmit">{ReasonReact.string("Sign up")}</button>
                        <a className="align-right close-form" href="#intro">{ReasonReact.string("Back")}</a>
                    </div>
                    <p className="panel-footer"><b>{ReasonReact.string("What happens next?")}</b> {ReasonReact.string("Our system will use these details to automatically try to find you a driver. If there is a match, the driver will get in touch to arrange the ride.")}</p>
                </div>
            </div>
        </form>

        <form id="offer-ride" name="offerRide" action="{{ api }}/driver" method="post" className="ride-form-op" ariaHidden=true>
            <input type_="hidden" name="_redirect" className="redirect" value="{{ cp_site }}/thanks-driver/?type_=driver" />
            <div className="bannerbox">
                <h2 className="bannerbox__title">{ReasonReact.string("I can offer a ride")}</h2>
                <div className="bannerbox__content">
                    <a className="close-form button--cancel" href="#intro" ariaLabel="Close form" role="button" ariaControls="offer-ride">hmtlTimesEntity</a>

                    <fieldset className="driver-select-org">
                        <legend>{ReasonReact.string("Choose your organization")}</legend>

                        <p>{ReasonReact.string("Please choose this carefully as otherwise you may be asked to re-enter your details. Check with your organization if you are not sure.")}</p>

                        <div className="form-column">
                            <div className="form-group">
                                <input id="DrivingOnBehalfOfOrganization" name="DrivingOnBehalfOfOrganization" type_="hidden" value="true" />
                                <label htmlFor="DrivingOBOOrganizationName">{ReasonReact.string("Organization name")}</label>
                                <select id="DrivingOBOOrganizationName" name="DrivingOBOOrganizationName" required=true>
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
                        <button className="add-time-btn button" ariaControls="DriverAvailableTimes">hmtlPlusEntity{ReasonReact.string(" Add another date / time")}</button>
                        <small>{ReasonReact.string("(Add as many dates and time ranges as you like)")}</small>
                        <input type_="hidden" className="hiddenJSONTimes" name="AvailableDriveTimesJSON" />
                    </fieldset>

                    <fieldset>
                        <legend>{ReasonReact.string("Location and vehicle")}</legend>

                        <div className="form-group">
                            <label htmlFor="rideArea">{ReasonReact.string("Driving ZIP code")}</label>
                            <input type_="text" className="form-input form-input--medium" pattern=regexPattern id="offerArea" placeholder="Where can you pick up the rider?" name="DriverCollectionZIP" required=true />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group">
                            <p>{ReasonReact.string("I am willing to collect within a")} 
                            <input type_="number" id="offerMiles" name="DriverCollectionRadius" min=0 step=1.0 className="form-input form-input--inline" placeholder="e.g. 10" required=true />
                            {ReasonReact.string("mile radius of this zip code.")}
                            </p>
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="driverSeats">{ReasonReact.string("Passenger seats available in vehicle")}</label>
                            <input type_="number" min=0 className="form-input form-input--small" id="driverSeats" name="SeatCount" placeholder="e.g. 2" required=true />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group checkbox">
                            <label htmlFor="driverWheelchair">
                                <input type_="checkbox" name="DriverCanLoadRiderWithWheelchair" id="driverWheelchair"/> {ReasonReact.string("I have an adapted van with space for a powerchair")}
                            </label>
                        </div>
                        <div className="form-group checkbox">
                            <label htmlFor="offerInsurance">
                                <input type_="checkbox" name="DriverHasInsurance" id="offerInsurance" required=true/> {ReasonReact.string("I confirm the driver has insurance")}
                            </label>
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="driverLicence">{ReasonReact.string("Vehicle licence plate number")}</label>
                            <input type_="text" className="form-input form-input--medium" id="driverLicence" name="DriverLicenceNumber" required=true />
                            <div className="help-block with-errors"></div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>{ReasonReact.string("Your details")}</legend>

                        <div className="form-group">
                            <label htmlFor="driverFirstName">{ReasonReact.string("First name")}</label>
                            <input type_="text" className="form-input" id="driverFirstName" placeholder="Your first name" name="DriverFirstName" required=true />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="driverLastName">{ReasonReact.string("Last name")}</label>
                            <input type_="text" className="form-input" id="driverLastName" placeholder="Your last name" name="DriverLastName" required=true />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="driverEmail">{ReasonReact.string("Email address")}</label>
                            <input type_="email" className="form-input" id="driverEmail" placeholder="Email address" name="DriverEmail" required=true />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="driverPhone">{ReasonReact.string("Cell phone number")}</label>
                            <input type_="tel" className="form-input" id="driverPhone" placeholder="Phone" name="DriverPhone" required=true />
                            <div className="help-block with-errors"></div>
                        </div>
                        <div className="form-group checkbox checkbox--multi">
                            <p>{ReasonReact.string("Preferred notification method (choose as many as you like)")}</p>
                            <label>
                                <input type_="checkbox" name="DriverPreferredContact" value="Email" /> {ReasonReact.string("Email")}
                            </label>
                            <label>
                                <input type_="checkbox" name="DriverPreferredContact" value="SMS" /> {ReasonReact.string("SMS")}
                            </label>
                        </div>
                    </fieldset>

                    <div className="form-group checkbox">
                        <label htmlFor="DriverAgreeTnC">
                            <input type_="checkbox" id="DriverAgreeTnC" name="DriverAgreeTnC" required=true /> {ReasonReact.string("I agree to the")} <a href="terms-conditions/" target="_blank">{ReasonReact.string("Terms ")}hmtlAmpEntity{ReasonReact.string(" Conditions.")}</a>
                        </label>
                        <small>{ReasonReact.string("I understand that Carpool Vote LLC will share my contact details with the driver if there's a match. (Carpool Vote will not share personal details with anybody else, unless required by law, and will destroy them within three months of election day if you've asked us not to stay in touch.)")}</small>
                        <small>{ReasonReact.string("I understand that Carpool Vote provides introductions between riders and volunteer drivers who have signed up on the platform. I understand that anybody can sign up to drive and Carpool Vote is unable to perform any background checks on people who use the platform. As with any other environment where I meet new people, I will take steps to keep myself and my possessions safe and accept that Carpool Vote LLC cannot be responsible if anything goes wrong.")}</small>
                        <small>{ReasonReact.string("I understand that Carpool Vote cannot guarantee that I will find appropriate matches through the platform, or that any agreed ride will occur. I take full responsibility for any cost related to using the platform.")}</small>
                        <small>{ReasonReact.string("I understand that this service is open to any driver or rider - no matter what their personal background or beliefs. To help make sure that both the driver and I feel comfortable and safe, I promise that I will not discuss politics during the journey.")}</small>
                    </div>
                    <div className="form-group checkbox">
                        <label htmlFor="inTouchDriver">
                            <input type_="checkbox" id="inTouchDriver" name="PleaseStayInTouch" checked=true /> {ReasonReact.string("We'd like to keep you updated from time to time about how the project is progressing. Please untick this box if you'd prefer us not to do this.")}
                        </label>
                    </div>
                    <div className="form-group">
                        <button type_="submit" className="button button--large" id="offerRideSubmit">{ReasonReact.string("Sign up")}</button>
                        <a className="align-right close-form" href="#intro">{ReasonReact.string("Back")}</a>
                    </div>
                    <p className="panel-footer"><b>{ReasonReact.string("What happens next?")}</b> {ReasonReact.string("Our system will use these details to try to find riders. If there is a potential match, we'll send you a notification. If you accept the match, we'll let the rider know that you'll be in touch to arrange the ride.")}</p>
                </div>
            </div>
        </form>
    </div>
    </div>
  </div>},
}};

let default = ReasonReact.wrapReasonForJs(~component, 
jsProps => make(~loginInfo=jsProps->loginInfoGet, ~apiInfo=jsProps->apiInfoGet, 
~inputFormsInfo=jsProps->inputFormsInfoGet,
~setDriverDateInfo=jsProps->setDriverDateInfoGet,
~setDriverFormInfo=jsProps->setDriverFormInfoGet,
~setRiderDateInfo=jsProps->setRiderDateInfoGet,
~setRiderFormInfo=jsProps->setRiderFormInfoGet,
[||]));
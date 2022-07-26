let component = ReasonReact.statelessComponent("Matches");

[@bs.deriving abstract]
type driverOrRiderPartial = {
   [@bs.as "UUID"] uuid: string
};

[@bs.deriving abstract]
type systemMatch = {
   status: string,
  uuid_driver: string,
  uuid_rider: string,     
  city: string,
  full_state: string,
  state: string,
  [@bs.as "DriverCollectionZIP"] driverCollectionZIP: string,
  [@bs.as "AvailableDriveTimesLocal"] availableDriveTimesLocal: string,
  [@bs.as "SeatCount"] seatCount: string,
  [@bs.as "DriverLicenseNumber"] driverLicenseNumber: string,
  [@bs.as "DrivingOBOOrganizationName"] drivingOBOOrganizationName: string,
  [@bs.as "DriverFirstName"] driverFirstName: string,
  [@bs.as "DriverLastName"] driverLastName: string,
  [@bs.as "RiderFirstName"] firstName: string,
  [@bs.as "RiderEmail"] email: string,
  [@bs.as "RiderLastName"] lastName: string,
  [@bs.as "RiderPhone"] phone: string,
  [@bs.as "RiderCollectionZIP"] collectionZip: string,
  [@bs.as "RiderDropOffZIP"] dropOffZIP: string,
  [@bs.as "AvailableRideTimesLocal"] rideTimesLocal: string,
  [@bs.as "RiderCollectionStreetNumber"] collectionStreetNumber: string,
  [@bs.as "RiderCollectionAddress"] collectionAddress: string,
  [@bs.as "RiderDestinationAddress"] destinationAddress: string,
  driver_notes: string,
	rider_notes: string,
  [@bs.as "created_ts"] created: string,
  [@bs.as "last_updated_ts"] updated: string,
  score: int,
};

[@bs.deriving abstract]
type matchRowInfo = {
  original: systemMatch 
};

type matchGetTdPropsHandler = (string, option(matchRowInfo), string, string) => TypeInfo.getTdPropsClickHandlerAndStyle;

[@bs.deriving abstract]
type matchesInfo = {
  showMatchList: bool,  
  showDownloadLink: bool,
  urlDownloadBlob: string,
  matches: array(systemMatch),
  listPageIndex: int,
  listPageSize: int,
  hideExpiredCanceled: bool,
  hideConfirmed: bool,
  showCurrentMatchDetails: bool,
  currentMatch: (systemMatch),
  currentDriver: (driverOrRiderPartial),
  currentRider: (driverOrRiderPartial),
  showMatchForCurrentDriverOnly: bool,
  showMatchForCurrentRiderOnly: bool
};

[@bs.deriving abstract]
type matchTableJsProps = {
  className: string,
  [@bs.as "type"] type_: string,
  columns: array(TypeInfo.theaderCell),
  defaultPageSize: int,
  /* page: int, */
  pageSize: int,
  filterable: bool,
  data: array(systemMatch),
  onPageChange: TypeInfo.tableOnPageChangeHandler,
  onPageSizeChange: TypeInfo.tableOnPageChangeSizeHandler,
  getTdProps: matchGetTdPropsHandler
};

let tableType = "matches";

let matchTableColumns = 
  [| 
  Utils.thcCreator(~header="Driver", ~accessor="uuid_driver", ~width=100),
  Utils.thcCreator(~header="Rider", ~accessor="uuid_rider", ~width=100), 
  Utils.thcCreator(~header="City", ~accessor="city", ~width=100),
  Utils.thcCreator(~header="State", ~accessor="full_state", ~width=100),
  Utils.thcCreator(~header="StateShort", ~accessor="state", ~width=100),
  Utils.thcCreator(~header="Status", ~accessor="status", ~width=100),
  Utils.thcCreator(~header="Created", ~accessor="created_ts", ~width=160),
  Utils.thcCreator(~header="Updated", ~accessor="last_updated_ts", ~width=160),
  Utils.thcCreator(~header="DriverCollectionZIP", ~accessor="DriverCollectionZIP", ~width=100),
  Utils.thcCreator(~header="Drive Times - Local", ~accessor="AvailableDriveTimesLocal", ~width=160),
  Utils.thcCreator(~header="Seat Count", ~accessor="SeatCount", ~width=100),
  Utils.thcCreator(~header="License Number", ~accessor="DriverLicenseNumber", ~width=100),
  Utils.thcCreator(~header="Driving for Organization", ~accessor="DrivingOBOOrganizationName", ~width=100),
  Utils.thcCreator(~header="Driver First Name", ~accessor="DriverFirstName", ~width=100),
  Utils.thcCreator(~header="Driver Last Name", ~accessor="DriverLastName", ~width=100),
  Utils.thcCreator(~header="Rider First Name", ~accessor="RiderFirstName", ~width=100), 
  Utils.thcCreator(~header="Rider Last Name", ~accessor="RiderLastName", ~width=100),
  Utils.thcCreator(~header="Rider Email", ~accessor="RiderEmail", ~width=100), 
  Utils.thcCreator(~header="Rider Phone", ~accessor="RiderPhone", ~width=100),
  Utils.thcCreator(~header="Rider Collection ZIP", ~accessor="RiderCollectionZIP", ~width=100),
  Utils.thcCreator(~header="Rider Dropoff ZIP", ~accessor="RiderDropOffZIP", ~width=100),
  Utils.thcCreator(~header="Rider Collection Street Number", ~accessor="RiderCollectionStreetNumber", ~width=100),
  Utils.thcCreator(~header="Rider Collection Address", ~accessor="RiderCollectionAddress", ~width=100),
  Utils.thcCreator(~header="Rider Destination Address", ~accessor="RiderDestinationAddress", ~width=100),
  Utils.thcCreator(~header="Ride Times Local", ~accessor="AvailableRideTimesLocal", ~width=160), 
  Utils.thcCreator(~header="Driver Notes", ~accessor="driver_notes", ~width=100),
  Utils.thcCreator(~header="Rider Notes", ~accessor="rider_notes", ~width=100),
  Utils.thcCreator(~header="Score", ~accessor="score", ~width=100)
  |]; 

 let tableMatch = itemDetails:systemMatch => systemMatch(
  ~uuid_driver=itemDetails->uuid_driverGet,
  ~uuid_rider=itemDetails->uuid_riderGet,
  ~driver_notes=itemDetails->driver_notesGet,
  ~rider_notes=itemDetails->rider_notesGet,
  ~city=itemDetails->cityGet,
  ~full_state=itemDetails->full_stateGet,
  ~state=itemDetails->stateGet,
  ~status=itemDetails->statusGet,
  ~driverCollectionZIP=itemDetails->driverCollectionZIPGet,~availableDriveTimesLocal=itemDetails->availableDriveTimesLocalGet,~seatCount=itemDetails->seatCountGet,~driverLicenseNumber=itemDetails->driverLicenseNumberGet,
  ~drivingOBOOrganizationName=itemDetails->drivingOBOOrganizationNameGet,~driverFirstName=itemDetails->driverFirstNameGet,~driverLastName=itemDetails->driverLastNameGet,
  ~firstName=itemDetails->firstNameGet, 
  ~email=itemDetails->emailGet,  
  ~lastName=itemDetails->lastNameGet,
  ~phone=itemDetails->phoneGet,
  ~collectionZip=itemDetails->collectionZipGet,
  ~dropOffZIP=itemDetails->dropOffZIPGet,
  ~rideTimesLocal=itemDetails->rideTimesLocalGet,
  ~collectionStreetNumber=itemDetails->collectionStreetNumberGet,
  ~collectionAddress=itemDetails->collectionAddressGet,
  ~destinationAddress=itemDetails->destinationAddressGet,
  ~created=itemDetails->createdGet,
  ~updated=itemDetails->updatedGet,
  ~score=itemDetails->scoreGet,
);

[@bs.deriving abstract]
type jsProps = {
  others: bool,
  sectionHeading: string,
  loginInfo: TypeInfo.loginInfo,
  apiInfo: TypeInfo.apiInfo,
  matchesInfo: matchesInfo,  
  getMatchesList: (string, string) => unit,
  hideMatchesList: unit => unit,
  showMatchesListDownloadLink: string => unit,
  hideMatchesListDownloadLink: unit => unit,
  setInfoMatchesList: (int, int) => unit,  
  hideExpiredMatchesList: unit => unit,
  hideConfirmedMatchesList: unit => unit,
  showCurrentMatch: systemMatch => unit,
  hideCurrentMatch: unit => unit,
  showMatchForCurrentDriver: unit => unit,
  showMatchForCurrentRider: unit => unit
};

let make = (~others:bool, ~sectionHeading:string, ~loginInfo:TypeInfo.loginInfo, ~apiInfo:TypeInfo.apiInfo, 
~matchesInfo:matchesInfo, 
~getMatchesList, 
~hideMatchesList,
~showMatchesListDownloadLink,
~hideMatchesListDownloadLink,
~setInfoMatchesList,
~hideExpiredMatchesList,
~hideConfirmedMatchesList,
~showCurrentMatch,
~hideCurrentMatch,
~showMatchForCurrentDriver,
~showMatchForCurrentRider,
_children) => {

  let matchesTableOnPageChangeHandler: TypeInfo.tableOnPageChangeHandler = (pageIndex) => {
    let pageSize = matchesInfo->listPageSizeGet;

    Utils.setInfoJs(setInfoMatchesList, pageIndex, pageSize);
  };

  let matchesTableOnPageChangeSizeHandler: TypeInfo.tableOnPageChangeSizeHandler = (size, pageIndex) => {
    Utils.setInfoJs(setInfoMatchesList, pageIndex, size);
  };

  let matchesTdPropsHandler: matchGetTdPropsHandler = (_state, rowInfoOption, _column, _instance) => {

    let itemDriverUuid = switch rowInfoOption {
      | None => ""
      | Some(rowInfo) => rowInfo->originalGet->uuid_driverGet
    };
    
    let itemRiderUuid = switch rowInfoOption {
      | None => ""
      | Some(rowInfo) => rowInfo->originalGet->uuid_riderGet
    };
      
    let tableClickHandler: TypeInfo.tableOnClickHandler = (_e, handleOriginalOption) => {
    /* Js.log(ReactEvent.Form.target(e)); */
    /* Js.log(handleOriginal); */

      switch (rowInfoOption) {
        | None => {
            TypeInfo.unitArgAction(hideCurrentMatch);

            ();
        }
        | Some(rowInfo) => {
          /* Js.log(rowInfo);  */

          /* NOTE: without this step, dispatch prop does not work correctly - best to use typed version of bs raw section, in part because dispatch prop is optimised out of the function if not referenced in some way */
          let sr: (systemMatch => unit, option(systemMatch)) => unit = [%raw (fx, itemDetails) => "{ fx(itemDetails); return 0; }"];

          let itemDetails = rowInfo->originalGet;
          let currentMatch = tableMatch(itemDetails);

          sr(showCurrentMatch, Some(currentMatch));
        }
      };

      /* with bs 4.0.7 js functions with no params need to be called in this way. Before, they could be called directly, although it was different for functions with parameters */
      switch handleOriginalOption {
        | None => ()
        | Some(handleOriginal) => TypeInfo.unitArgAction(handleOriginal)
      };

      ();
    };

    let getBkgColour = () => {
      if (itemDriverUuid == matchesInfo->currentMatchGet->uuid_driverGet && itemRiderUuid == matchesInfo->currentMatchGet->uuid_riderGet) {
        Defaults.highlightSelectedRowBackgroundColour
      }
      else {
        Defaults.defaultRowBackgroundColour
      }
    };

    let bkgStyle = ReactDOMRe.Style.make(~background=getBkgColour(), ());

    let clickHandlerAndStyleObjectWrapper = TypeInfo.getTdPropsClickHandlerAndStyle(~onClick=tableClickHandler, ~style=bkgStyle);
    
    clickHandlerAndStyleObjectWrapper;
  };

  let matchesTableHideExpiredHandler = _ => {
    TypeInfo.unitArgAction(hideExpiredMatchesList);

    ();
  }

  let matchesTableHideConfirmedHandler = _ => {
    TypeInfo.unitArgAction(hideConfirmedMatchesList);

    ();
  }

  let matchesTableShowMatchForCurrentDriverHandler = _ => {
    TypeInfo.unitArgAction(showMatchForCurrentDriver);

    ();
  }

  let matchesTableShowMatchForCurrentRiderHandler = _ => {
    TypeInfo.unitArgAction(showMatchForCurrentRider);

    ();
  }

  let handleGetMatchListClick = (_event) => {
    let token = loginInfo->TypeInfo.tokenGet;
    let url = apiInfo->TypeInfo.apiUrlGet;

    /* NOTE: without this step, dispatch prop does not work correctly - best to use typed version of bs raw section, in part because dispatch prop is optimised out of the function if not referenced in some way */
    let gl: ((string, string) => unit, string, string) => unit = [%raw (fx, url, token) => "{ fx(url, token); return 0; }"];

    gl(getMatchesList, url, token);

    ();
  };

  let handleHideMatchListClick = (_event) => {
    TypeInfo.unitArgAction(hideMatchesList);

    ();
  };

  let handleShowMatchesListDownloadLinkClick = (_event) => {
    let tableMatchesAll:array(systemMatch) = Array.map(tableMatch, matchesInfo->matchesGet); 

    let createBlob: array(systemMatch) => string = [%raw (matches) => "{ 
      const jsonm = JSON.stringify(matches);
      const blob = new Blob([jsonm], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      return url; }"];

    let urlBlob: string = createBlob(tableMatchesAll);

    TypeInfo.stringArgAction(showMatchesListDownloadLink, urlBlob);

    ();
  };

  let handleHideMatchesListDownloadLinkClick = (_event) => {
    TypeInfo.unitArgAction(hideMatchesListDownloadLink);

    ();
  };

  {
  ...component,
  render: (_self) => { 
    let tableMatchesAll:array(systemMatch) = Array.map(tableMatch, matchesInfo->matchesGet); 

    let confirms = Utils.filterArray(~f=m=>m->statusGet=="MatchConfirmed", tableMatchesAll);

    let confirmsKeys = Array.map(c => c->uuid_riderGet, confirms);

    let filterProposedAndConfirmed = m => {
      let s = m->statusGet;
      let key = m->uuid_riderGet;
      
      if (s != "MatchProposed" && s != "ExtendedMatch") {
        true;
      } 
      else if (s == "ExtendedMatch") {
        false;
      } 
      else  {
        let keyMatched = k=>{
          if (k == key) {
            true;
          }
          else {
            false;
          }
        };

        let xx = Utils.existsArray(~f=keyMatched, confirmsKeys);

        !(xx);
      }
    };

    let filterExpiredMatches = matches => {
      if (matchesInfo->hideExpiredCanceledGet === true) {
        let filterMatches = rider => rider->statusGet !== "Expired" && rider->statusGet !== "Canceled";

        let matchesNotExpired = Utils.filterArray(~f=filterMatches, matches);
          
        matchesNotExpired;
      }
      else {
        matches;
      };
    };

    let filterConfirmedMatches = matches => {
      if (matchesInfo->hideConfirmedGet === true) {
        let filterMatches = match => match->statusGet !== "MatchConfirmed";

        let matchesNotConfirmed = Utils.filterArray(~f=filterMatches, matches);
          
        matchesNotConfirmed;
      }
      else {
        matches;
      };
    };

    let filterCurrentRiderMatches = matches => {
      if (matchesInfo->showMatchForCurrentRiderOnlyGet === true) {
        let currentRiderUuid = matchesInfo->currentRiderGet->uuidGet;

        /* to be decided - show all or none if no rider selected */
        /* if (String.length (currentRiderUuid) > 0) { */
          Js.log("filter matches by current rider" ++ currentRiderUuid);

          let filterMatches = match => match->uuid_riderGet === currentRiderUuid;
          let matchesForCurrentRider = Utils.filterArray(~f=filterMatches, matches);
            
          matchesForCurrentRider; 
        /* } else {
          matches;
        } */
      }
      else {
        matches;
      };
    };

    let filterCurrentDriverMatches = matches => {
      if (matchesInfo->showMatchForCurrentDriverOnlyGet === true) {
        let currentDriverUuid = matchesInfo->currentDriverGet->uuidGet;

        Js.log("filter matches by current driver" ++ currentDriverUuid);

        let filterMatches = match => match->uuid_driverGet === currentDriverUuid;
        let matchesForCurrentDriver = Utils.filterArray(~f=filterMatches, matches);
          
        matchesForCurrentDriver; 
      }
      else {
        matches;
      };
    };

    let tableMatchesStepZero = Utils.filterArray(~f=filterProposedAndConfirmed, tableMatchesAll); 

    let tableMatchesStepOne = filterExpiredMatches(tableMatchesStepZero);
    let tableMatchesStepTwo = filterConfirmedMatches(tableMatchesStepOne);
    let tableMatchesStepThree = filterCurrentRiderMatches(tableMatchesStepTwo);
    let tableMatches = filterCurrentDriverMatches(tableMatchesStepThree);

    let tableDivStyle = ReactDOMRe.Style.make(~marginTop="20px", ~marginBottom="10px", ());

    let checkboxAreaStyle = ReactDOMRe.Style.make(~marginTop="20px", ~display="inline-block", ());

    let checkboxLabelStyle = ReactDOMRe.Style.make(~paddingRight="40px", ());

    let currentMatchItemDivStyle = ReactDOMRe.Style.make(~marginBottom="10px",());

    let currentMatchItemSpanStyle = ReactDOMRe.Style.make(
    ~marginLeft="10px", ()
    );

    let downloadLinkButtonSpanStyle = ReactDOMRe.Style.make(
    ~marginLeft="130px", ()
    );

    let downloadLinkAnchorStyle = ReactDOMRe.Style.make(
    ~marginLeft="15px", ()
    );

    let currentMatchStatusSpanStyle = status => switch (status != "MatchConfirmed") {
    | true => ReactDOMRe.Style.make(
    ~marginLeft="10px", ()
    );
    | false => ReactDOMRe.Style.make(
    ~marginLeft="10px", ~fontWeight="700", ()
    );
    }; 

    let currentMatchInfo = currentMatch => {
      <div>
        <h3>{ReasonReact.string("Current match info:")}</h3>
        <div style={currentMatchItemDivStyle}>
          <span style={currentMatchItemSpanStyle}>{ReasonReact.string("Driver uuid: " ++ currentMatch->uuid_driverGet)}</span>
          <span style={currentMatchItemSpanStyle}>{ReasonReact.string(currentMatch->driverFirstNameGet ++ " " ++ currentMatch->driverLastNameGet )}</span>
        </div>
        <div style={currentMatchItemDivStyle}>
          <span style={currentMatchItemSpanStyle}>    {ReasonReact.string("Rider uuid: " ++ currentMatch->uuid_riderGet) }</span>
          <span style={currentMatchItemSpanStyle}>{ReasonReact.string(currentMatch->firstNameGet ++ " " ++currentMatch->lastNameGet )}</span>
          <span style={currentMatchItemSpanStyle}>{ReasonReact.string(currentMatch->emailGet)}</span>
        </div>
        <div style={currentMatchItemDivStyle}>          
          <span style={currentMatchStatusSpanStyle(currentMatch->statusGet)}>          
          {ReasonReact.string(currentMatch->statusGet)}
          </span>
        </div>
      </div>
    };

    let downloadBlobName = switch others {
    | true => " - matches others - backup.json"
    | false => " - matches - backup.json"
    };

    let tableMatchesJSX = 
      if (matchesInfo->showMatchListGet) {
        <div>
            <div>
              <button
                className="button button--large"
                id="hideMatchListButton" 
                onClick={handleHideMatchListClick}
              >{ReasonReact.string("Hide List")}
              </button>
              <LeftPaddedButton props={LeftPaddedButton.leftPaddedButtonProps} className="button button--large" id="refreshMatchesListButton" onClick={handleGetMatchListClick} >{ReasonReact.string("Refresh List")}</LeftPaddedButton>
              {switch (matchesInfo->showDownloadLinkGet) {
                | true => <span style={downloadLinkButtonSpanStyle}>
                  <LeftPaddedButton props={LeftPaddedButton.leftPaddedButtonProps} className="button button--large" id="hideMatchesListDownloadLinkButton" onClick={handleHideMatchesListDownloadLinkClick} >{ReasonReact.string("Hide Download Link")}</LeftPaddedButton>
                  <a style={downloadLinkAnchorStyle} className="button button--large" download={loginInfo->TypeInfo.detailsGet->TypeInfo.usernameGet ++ downloadBlobName} href={matchesInfo->urlDownloadBlobGet}>
                    {ReasonReact.string("Download backup")}
                  </a>
                </span>
                | false =><span style={downloadLinkButtonSpanStyle}> <LeftPaddedButton props={LeftPaddedButton.leftPaddedButtonProps} className="button button--large" id="showMatchesListDownloadLinkButton" onClick={handleShowMatchesListDownloadLinkClick} >{ReasonReact.string("Show Download Link")}</LeftPaddedButton></span>}
              }
            </div>
          <div> 
            <div className="form-group checkbox" style={checkboxAreaStyle}>
              <label className="" style={checkboxLabelStyle} htmlFor="hideExpired">{ReasonReact.string("Hide Expired/Cancelled")}
              </label>
              <input className="" type_="checkbox" id="hideExpired" checked={matchesInfo->hideExpiredCanceledGet} onChange={matchesTableHideExpiredHandler} />
            </div> 
            <div className="form-group checkbox" style={checkboxAreaStyle}>
              <label className="" style={checkboxLabelStyle} htmlFor="hideConfirmed">{ReasonReact.string("Hide Confirmed")}
              </label>
              <input className="" type_="checkbox" id="hideConfirmed" checked={matchesInfo->hideConfirmedGet} onChange={matchesTableHideConfirmedHandler} />
            </div> 
            <span>
                <div className="form-group checkbox" style={checkboxAreaStyle}>
                  <label className="" style={checkboxLabelStyle} htmlFor="showMatchForCurrentDriverOnly">{ReasonReact.string("Show Match For Current Driver Only")}
                  </label>
                  <input className="" type_="checkbox" id="showMatchForCurrentDriverOnly" checked={matchesInfo->showMatchForCurrentDriverOnlyGet} onChange={matchesTableShowMatchForCurrentDriverHandler} />
                </div>
                <div className="form-group checkbox" style={checkboxAreaStyle}>
                  <label className="" style={checkboxLabelStyle} htmlFor="showMatchForCurrentRiderOnly">{ReasonReact.string("Show Match For Current Rider Only")}
                  </label>
                  <input className="" type_="checkbox" id="showMatchForCurrentRiderOnly" checked={matchesInfo->showMatchForCurrentRiderOnlyGet} onChange={matchesTableShowMatchForCurrentRiderHandler} />
                </div> 
            </span> 
          </div> 
          <div style={tableDivStyle}> 
            <Table props={matchTableJsProps}  className="basicMatchTable" type_={tableType} columns={matchTableColumns}
            data=tableMatches
            defaultPageSize={5} /* get this from types default */
            pageSize={matchesInfo->listPageSizeGet}
            filterable={true}
            onPageChange={matchesTableOnPageChangeHandler}
            onPageSizeChange={matchesTableOnPageChangeSizeHandler}
            getTdProps={matchesTdPropsHandler}
            />
          </div>
          {switch (matchesInfo->showCurrentMatchDetailsGet) {
          | true => {currentMatchInfo(matchesInfo->currentMatchGet)}
          | false => <div>{ReasonReact.string("No match selected")}</div> 
          }; }
        </div>
      }
      else {
        <div>
          <button
            className="button button--large"
            id="showGetMatchList" 
            onClick={handleGetMatchListClick}
          >{ReasonReact.string("Show Matches List")}
          </button>
        </div>
      };

    let matchesInfoArea = 
      if (loginInfo->TypeInfo.loggedInGet) {
        <div>
          <h2 className="operator-page-heading">{ReasonReact.string(sectionHeading)}</h2>
          <div>        
            {tableMatchesJSX}
          </div>
        </div>
      }
      else {
        ReasonReact.null;
      };

    <div> 
      {matchesInfoArea}
    </div>
  }
}
};

/*   page={matchesInfo->listPageIndexGet}
    */

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
      make(
      ~others=jsProps->othersGet,
      ~sectionHeading=jsProps->sectionHeadingGet,
      ~loginInfo=jsProps->loginInfoGet,
      ~apiInfo=jsProps->apiInfoGet,
      ~matchesInfo=jsProps->matchesInfoGet,
      ~getMatchesList=jsProps->getMatchesListGet,
      ~hideMatchesList=jsProps->hideMatchesListGet,
      ~showMatchesListDownloadLink=jsProps->showMatchesListDownloadLinkGet,
      ~hideMatchesListDownloadLink=jsProps->hideMatchesListDownloadLinkGet,
      ~setInfoMatchesList=jsProps->setInfoMatchesListGet,
      ~hideExpiredMatchesList=jsProps->hideExpiredMatchesListGet,
      ~hideConfirmedMatchesList=jsProps->hideConfirmedMatchesListGet,
      ~showCurrentMatch=jsProps->showCurrentMatchGet,
      ~hideCurrentMatch=jsProps->hideCurrentMatchGet,
      ~showMatchForCurrentDriver=jsProps->showMatchForCurrentDriverGet,
      ~showMatchForCurrentRider=jsProps->showMatchForCurrentRiderGet,
      [||],
    )
  );


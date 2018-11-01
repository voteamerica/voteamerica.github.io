let component = ReasonReact.statelessComponent("Matches");

[@bs.deriving abstract]
type systemMatch = {
   status: string,
  uuid_driver: string,
  uuid_rider: string,     
  city: string,
  full_state: string,
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
  matches: array(systemMatch),
  listPageIndex: int,
  listPageSize: int,
  hideExpiredCanceled: bool,
  hideConfirmed: bool,
  showCurrentMatchDetails: bool,
  currentMatch: (systemMatch)
};

[@bs.deriving abstract]
type matchTableJsProps = {
  className: string,
  [@bs.as "type"] type_: string,
  columns: array(TypeInfo.theader),
  defaultPageSize: int,
  page: int,
  pageSize: int,
  data: array(systemMatch),
  onPageChange: TypeInfo.tableOnPageChangeHandler,
  onPageSizeChange: TypeInfo.tableOnPageChangeSizeHandler,
  getTdProps: matchGetTdPropsHandler
};

let tableType = "matches";

let matchTableColumns = 
  [| 
  TypeInfo.theader(~header="Driver", ~accessor="uuid_driver"),
  TypeInfo.theader(~header="Rider", ~accessor="uuid_rider"), 
  TypeInfo.theader(~header="City", ~accessor="city"),
  TypeInfo.theader(~header="State", ~accessor="full_state"),
  TypeInfo.theader(~header="Status", ~accessor="status"),
  TypeInfo.theader(~header="Created", ~accessor="created_ts"),
  TypeInfo.theader(~header="Updated", ~accessor="last_updated_ts"),
  TypeInfo.theader(~header="DriverCollectionZIP", ~accessor="DriverCollectionZIP"),
  TypeInfo.theader(~header="Drive Times - Local", ~accessor="AvailableDriveTimesLocal"),TypeInfo.theader(~header="Seat Count", ~accessor="SeatCount"),
  TypeInfo.theader(~header="License Number", ~accessor="DriverLicenseNumber"),
  TypeInfo.theader(~header="Driving for Organization", ~accessor="DrivingOBOOrganizationName"),
  TypeInfo.theader(~header="Driver First Name", ~accessor="DriverFirstName"),
  TypeInfo.theader(~header="Driver Last Name", ~accessor="DriverLastName"),
  TypeInfo.theader(~header="Rider First Name", ~accessor="RiderFirstName"), 
  TypeInfo.theader(~header="Rider Last Name", ~accessor="RiderLastName"),
  TypeInfo.theader(~header="Rider Email", ~accessor="RiderEmail"), 
  TypeInfo.theader(~header="Rider Phone", ~accessor="RiderPhone"),
  TypeInfo.theader(~header="Rider Collection ZIP", ~accessor="RiderCollectionZIP"),
  TypeInfo.theader(~header="Rider Dropoff ZIP", ~accessor="RiderDropOffZIP"),
  TypeInfo.theader(~header="Rider Collection Street Number", ~accessor="RiderCollectionStreetNumber"),
  TypeInfo.theader(~header="Rider Collection Address", ~accessor="RiderCollectionAddress"),
  TypeInfo.theader(~header="Rider Destination Address", ~accessor="RiderDestinationAddress"),
  TypeInfo.theader(~header="Ride Times Local", ~accessor="AvailableRideTimesLocal"), 
  TypeInfo.theader(~header="Driver Notes", ~accessor="driver_notes"),
  TypeInfo.theader(~header="Rider Notes", ~accessor="rider_notes"),
  TypeInfo.theader(~header="Score", ~accessor="score"),
  |]; 

 let tableMatch = itemDetails:systemMatch => systemMatch(
  ~uuid_driver=itemDetails->uuid_driverGet,
  ~uuid_rider=itemDetails->uuid_riderGet,
  ~driver_notes=itemDetails->driver_notesGet,
  ~rider_notes=itemDetails->rider_notesGet,
  ~city=itemDetails->cityGet,
  ~full_state=itemDetails->full_stateGet,
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
  sectionHeading: string,
  loginInfo: TypeInfo.loginInfo,
  apiInfo: TypeInfo.apiInfo,
  matchesInfo: matchesInfo,  
  getMatchesList: (string, string) => unit,
  hideMatchesList: unit => unit,
  showMatchesListDownloadLink: unit => unit,
  hideMatchesListDownloadLink: unit => unit,
  setInfoMatchesList: (int, int) => unit,  
  hideExpiredMatchesList: unit => unit,
  hideConfirmedMatchesList: unit => unit,
  showCurrentMatch: systemMatch => unit,
  hideCurrentMatch: unit => unit,
};

let make = (~sectionHeading:string, ~loginInfo:TypeInfo.loginInfo, ~apiInfo:TypeInfo.apiInfo, ~matchesInfo:matchesInfo, 
~getMatchesList, 
~hideMatchesList,
~showMatchesListDownloadLink,
~hideMatchesListDownloadLink,
~setInfoMatchesList,
~hideExpiredMatchesList,
~hideConfirmedMatchesList,
~showCurrentMatch,
~hideCurrentMatch,
_children) => {

  let matchesTableOnPageChangeHandler: TypeInfo.tableOnPageChangeHandler = (pageIndex) => {
    let pageSize = matchesInfo->listPageSizeGet;

    Utils.setInfoJs(setInfoMatchesList, pageIndex, pageSize);
  };

  let matchesTableOnPageChangeSizeHandler: TypeInfo.tableOnPageChangeSizeHandler = (size, pageIndex) => {
    /* let pageIndex = matchesInfo->listPageIndexGet; */

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
            /* NOTE: if the jsProps type is correct, a (unit => unit) dispatch prop function can be called directly */
            hideCurrentMatch();

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

      switch handleOriginalOption {
        | None => ()
        | Some(handleOriginal) => handleOriginal()
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
    hideExpiredMatchesList();
  }

  let matchesTableHideConfirmedHandler = _ => {
    hideConfirmedMatchesList();
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
    /* NOTE: if the jsProps type is correct, a (unit => unit) dispatch prop function can be called directly */
    hideMatchesList();

    ();
  };

  let handleShowMatchesListDownloadLinkClick = (_event) => {
    /* NOTE: if the jsProps type is correct, a (unit => unit) dispatch prop function can be called directly */
    showMatchesListDownloadLink();

    ();
  };

  let handleHideMatchesListDownloadLinkClick = (_event) => {
    /* NOTE: if the jsProps type is correct, a (unit => unit) dispatch prop function can be called directly */
    hideMatchesListDownloadLink();

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
        let filterMatches = rider => rider->statusGet !== "MatchConfirmed";

        let matchesNotConfirmed = Utils.filterArray(~f=filterMatches, matches);
          
        matchesNotConfirmed;
      }
      else {
        matches;
      };
    };

    let tableMatchesStepZero = Utils.filterArray(~f=filterProposedAndConfirmed, tableMatchesAll); 

    let tableMatchesStepOne = filterExpiredMatches(tableMatchesStepZero);
    let tableMatches = filterConfirmedMatches(tableMatchesStepOne);

    let tableDivStyle = ReactDOMRe.Style.make(~marginTop="20px", ~marginBottom="10px", ());

    let checkboxAreaStyle = ReactDOMRe.Style.make(~marginTop="20px", ~display="inline-block", ());

    let checkboxLabelStyle = ReactDOMRe.Style.make(~paddingRight="40px", ());

    let currentMatchItemDivStyle = ReactDOMRe.Style.make(~marginBottom="10px",());

    let currentMatchItemSpanStyle = ReactDOMRe.Style.make(
    ~marginLeft="10px", ()
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

    /* NOTE: without this step, dispatch prop does not work correctly - best to use typed version of bs raw section, in part because dispatch prop is optimised out of the function if not referenced in some way */
    let createBlob: array(systemMatch) => string = [%raw (matches) => "{ 
      const jsonr = JSON.stringify(matches);
      const blob = new Blob([jsonr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      return url; }"];

    let urlBlob: string = 
      switch (matchesInfo->showDownloadLinkGet) {
              | true => createBlob(tableMatchesAll);
              | false => "";
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
                | true => <span>
                  <LeftPaddedButton props={LeftPaddedButton.leftPaddedButtonProps} className="button button--large" id="hideMatchesListDownloadLinkButton" onClick={handleHideMatchesListDownloadLinkClick} >{ReasonReact.string("Hide Download Link")}</LeftPaddedButton>
                  <a style={downloadLinkAnchorStyle} className="button button--large" download="matches - backup.json" href={urlBlob}>
                    {ReasonReact.string("Download backup")}
                  </a>
                </span>
                | false => <LeftPaddedButton props={LeftPaddedButton.leftPaddedButtonProps} className="button button--large" id="showMatchesListDownloadLinkButton" onClick={handleShowMatchesListDownloadLinkClick} >{ReasonReact.string("Show Download Link")}</LeftPaddedButton>}
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
          </div> 
          <div style={tableDivStyle}> 
            <Table props={matchTableJsProps}  className="basicMatchTable" type_={tableType} columns={matchTableColumns}
            data=tableMatches
            defaultPageSize={5} /* get this from types default */
            page={matchesInfo->listPageIndexGet}
            pageSize={matchesInfo->listPageSizeGet}
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

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
      make(
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
      [||],
    )
  );


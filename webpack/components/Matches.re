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
  matches: array(systemMatch),
  listPageIndex: int,
  listPageSize: int,
  showCurrentMatchDetails: bool,
  currentMatch: (systemMatch)
};

[@bs.deriving abstract]
type matchTableJsProps = {
  className: string,
  [@bs.as "type"] type_: string,
  columns: array(TypeInfo.theader),
  defaultPageSize: int,
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
  ~created=itemDetails->createdGet,
  ~updated=itemDetails->updatedGet,
  ~score=itemDetails->scoreGet,
);

let make = (~loginInfo:TypeInfo.loginInfo, ~apiInfo:TypeInfo.apiInfo, ~matchesInfo:matchesInfo, 
~getMatchesList, 
~hideMatchesList,
~setInfoMatchesList,
~showCurrentMatch,
~hideCurrentMatch,
_children) => {

  let matchesTableOnPageChangeHandler: TypeInfo.tableOnPageChangeHandler = (pageIndex) => {
    Js.log(pageIndex);
  };

  let matchesTableOnPageChangeSizeHandler: TypeInfo.tableOnPageChangeSizeHandler = (size, _index) => {
    Js.log(size);

    let pageIndex = matchesInfo->listPageIndexGet;

    /* NOTE: without this step, dispatch prop does not work correctly - best to use typed version of bs raw section, in part because dispatch prop is optimised out of the function if not referenced in some way */
    let f: ((int, int) => unit, int, int) => unit = [%raw (fx, index, size) => "{ fx(index, size); return 0; }"];

    f(setInfoMatchesList, pageIndex, size);
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
          Js.log(rowInfo); 

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
        TypeInfo.highlightSelectedRowBackgroundColour
      }
      else {
        TypeInfo.defaultRowBackgroundColour
      }
    };

    let bkgStyle = ReactDOMRe.Style.make(~background=getBkgColour(), ());

    let clickHandlerAndStyleObjectWrapper = TypeInfo.getTdPropsClickHandlerAndStyle(~onClick=tableClickHandler, ~style=bkgStyle);
    
    clickHandlerAndStyleObjectWrapper;
  };

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

  {
  ...component,
  render: (_self) => { 
    let tableMatches:array(systemMatch) = Array.map(tableMatch, matchesInfo->matchesGet); 

    let tableDivStyle = ReactDOMRe.Style.make(~marginTop="20px", ~marginBottom="10px", ());

    let currentMatchInfo = currentMatch => {
      <div>
        <h3>{ReasonReact.string("Current match info:")}</h3>
        <div>{ReasonReact.string("Driver uuid: " ++ currentMatch->uuid_driverGet)}
        </div>
        <div>{ReasonReact.string("Rider uuid: " ++ currentMatch->uuid_riderGet) }
        </div>
        <div>{ReasonReact.string(currentMatch->statusGet)}
        </div>
      </div>
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
            </div>
          <div style={tableDivStyle}> 
            <Table props={matchTableJsProps}  className="basicMatchTable" type_={tableType} columns={matchTableColumns}
            data=tableMatches
            defaultPageSize={5} /* get this from types default */
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
          <h2 className="operator-page-heading">{ReasonReact.string("Matches Info")}</h2>
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
}};

[@bs.deriving abstract]
type jsProps = {
  loginInfo: TypeInfo.loginInfo,
  apiInfo: TypeInfo.apiInfo,
  matchesInfo: matchesInfo,  
  getMatchesList: (string, string) => unit,
  hideMatchesList: unit => unit,
  setInfoMatchesList: (int, int) => unit,
  showCurrentMatch: systemMatch => unit,
  hideCurrentMatch: unit => unit,
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
      make(
      ~loginInfo=jsProps->loginInfoGet,
      ~apiInfo=jsProps->apiInfoGet,
      ~matchesInfo=jsProps->matchesInfoGet,
      ~getMatchesList=jsProps->getMatchesListGet,
      ~hideMatchesList=jsProps->hideMatchesListGet,
      ~setInfoMatchesList=jsProps->setInfoMatchesListGet,
      ~showCurrentMatch=jsProps->showCurrentMatchGet,
      ~hideCurrentMatch=jsProps->hideCurrentMatchGet,
      [||],
    )
  );

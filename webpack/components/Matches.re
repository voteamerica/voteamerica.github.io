let component = ReasonReact.statelessComponent("Matches");

[@bs.deriving abstract]
type matchx = {
   [@bs.as "UUID"] uuid: string,
   [@bs.as "RiderFirstName"] firstName: string,
   [@bs.as "RiderEmail"] email: string,
   [@bs.as "RiderLastName"] lastName: string,
   [@bs.as "RiderPhone"] phone: string,
   [@bs.as "RiderCollectionZIP"] collectionZip: string,
   [@bs.as "RiderDropOffZIP"] dropOffZIP: string,
    /* "AvailableRideTimesLocal" character varying(2000),
    "TotalPartySize" integer DEFAULT 1 NOT NULL,
    "TwoWayTripNeeded" boolean NOT NULL,
    "RiderIsVulnerable" boolean NOT NULL,
    "RiderWillNotTalkPolitics" boolean NOT NULL,
    "PleaseStayInTouch" boolean NOT NULL,
    "NeedWheelchair" boolean NOT NULL,
    "RiderPreferredContact" character varying(50),
    "RiderAccommodationNotes" character varying(1000),
    "RiderLegalConsent" boolean NOT NULL,
    "ReadyToMatch" boolean DEFAULT true NOT NULL, */
   [@bs.as "created_ts"] created: string,
   [@bs.as "last_updated_ts"] updated: string,
 
 /*   status_info text,
    "RiderWillBeSafe" boolean NOT NULL,
	"RiderCollectionStreetNumber" character varying(10),
    "RiderCollectionAddress" character varying(1000),
    "RiderDestinationAddress" character varying(1000), */
   status: string,
   [@bs.as "uuid_organization"] organization: string,
};

[@bs.deriving abstract]
type matchRowInfo = {
  original: matchx 
};

type getTdPropsHandler = (string, option(matchRowInfo), string, string) => TypeInfo.getTdPropsClickHandler;

[@bs.deriving abstract]
type matchesInfo = {
  showRidersList: bool,
  matches: array(matchx),
  showCurrentRiderDetails: bool,
  currentRider: (matchx)
};

[@bs.deriving abstract]
type matchTableJsProps = {
  className: string,
  [@bs.as "type"] type_: string,
  columns: array(TypeInfo.theader),
  defaultPageSize: int,
  data: array(matchx),
  getTdProps: getTdPropsHandler
};

let tableType = "matches";

let matchTableCol1 = TypeInfo.theader(~header="First Name", ~accessor="RiderFirstName");
let matchTableCol2 = TypeInfo.theader(~header="Email", ~accessor="RiderEmail");
let matchTableCol3 = TypeInfo.theader(~header="Last Name", ~accessor="RiderLastName");

let matchTableColumns = 
  [| 
  TypeInfo.theader(~header="uuid", ~accessor="UUID"),matchTableCol1, 
  matchTableCol2, 
  matchTableCol3,
  TypeInfo.theader(~header="Phone", ~accessor="RiderPhone"),
  TypeInfo.theader(~header="Collection ZIP", ~accessor="RiderCollectionZIP"),
  TypeInfo.theader(~header="Dropoff ZIP", ~accessor="RiderDropOffZIP"),
  TypeInfo.theader(~header="Created", ~accessor="created_ts"),
  TypeInfo.theader(~header="Updated", ~accessor="last_updated_ts"),
  TypeInfo.theader(~header="Status", ~accessor="status"),
  TypeInfo.theader(~header="Org", ~accessor="uuid_organization"),
  |];

 let tableMatch = matchDetails:matchx => matchx(
  ~uuid=matchDetails->uuidGet,
  ~firstName=matchDetails->firstNameGet, ~email=matchDetails->emailGet,  ~lastName=matchDetails->lastNameGet,
  ~phone=matchDetails->phoneGet,
  ~collectionZip=matchDetails->collectionZipGet,
  ~dropOffZIP=matchDetails->dropOffZIPGet,
  ~organization=matchDetails->organizationGet,
  ~status=matchDetails->statusGet,
  ~created=matchDetails->createdGet,
  ~updated=matchDetails->updatedGet,
);

let make = (~loginInfo:TypeInfo.loginInfo, ~apiInfo:TypeInfo.apiInfo, ~matchesInfo:matchesInfo, 
~getRidersList, 
~hideRidersList,
~showCurrentRider,
~hideCurrentRider,
_children) => {

  let matchesTdPropsHandler: getTdPropsHandler = (_state, rowInfoOption, _column, _instance) => {

    let tableClickHandler: TypeInfo.tableOnClickHandler = (_e, handleOriginalOption) => {
      /* Js.log(ReactEvent.Form.target(e)); */
      /* Js.log(handleOriginal); */

      switch (rowInfoOption) {
      | None => {
          /* NOTE: if the jsProps type is correct, a (unit => unit) dispatch prop function can be called directly */
          hideCurrentRider();

          ();
      }
      | Some(rowInfo) => {
          Js.log(rowInfo); 

          /* NOTE: without this step, dispatch prop does not work correctly - best to use typed version of bs raw section, in part because dispatch prop is optimised out of the function if not referenced in some way */
          let sr: (matchx => unit, option(matchx)) => unit = [%raw (fx, matchDetails) => "{ fx(matchDetails); return 0; }"];

          let matchDetails = rowInfo->originalGet;
          let currentRider = tableMatch(matchDetails);

          sr(showCurrentRider, Some(currentRider));
        }
      };

      switch handleOriginalOption {
        | None => ()
        | Some(handleOriginal) => handleOriginal()
      };

      ();
    };

    let clickHandlerObjectWrapper = TypeInfo.getTdPropsClickHandler(~onClick=tableClickHandler);
    
    clickHandlerObjectWrapper;
  };

  let handleGetRidersListClick = (_event) => {
    let token = loginInfo->TypeInfo.tokenGet;
    let url = apiInfo->TypeInfo.apiUrlGet;

    /* NOTE: without this step, dispatch prop does not work correctly - best to use typed version of bs raw section, in part because dispatch prop is optimised out of the function if not referenced in some way */
    let gl: ((string, string) => unit, string, string) => unit = [%raw (fx, url, token) => "{ fx(url, token); return 0; }"];

    gl(getRidersList, url, token);

    ();
  };

  let handleHideDriversListClick = (_event) => {
    /* NOTE: if the jsProps type is correct, a (unit => unit) dispatch prop function can be called directly */
    hideRidersList();

    ();
  };

  {
  ...component,
  render: (_self) => { 
    let tableMatches:array(matchx) = Array.map(tableMatch, matchesInfo->matchesGet); 

    let tableDivStyle = ReactDOMRe.Style.make(~marginTop="20px", ~marginBottom="10px", ());

    let currentMatchInfo = currentMatch => {
      <div>
        <h3>{ReasonReact.string("Current match info:")}</h3>
        <div>{ReasonReact.string(currentMatch->firstNameGet ++ " " ++ currentMatch->lastNameGet) }
        </div>
        <div>{ReasonReact.string(currentMatch->emailGet)}
        </div>
      </div>
    };

    let tableMatchesJSX = 
      if (matchesInfo->showRidersListGet) {
        <div>
          <button
            className="button button--large"
            id="hideGetRidersList" 
            onClick={handleHideDriversListClick}
          >{ReasonReact.string("Hide List")}
          </button>
          <div style={tableDivStyle}> 
            <Table propsCtr={matchTableJsProps}  className="basicRiderTable" type_={tableType} columns={matchTableColumns}
            data=tableMatches
            getTdProps={matchesTdPropsHandler}
            />
          </div>
          {switch (matchesInfo->showCurrentRiderDetailsGet) {
          | true => {currentMatchInfo(matchesInfo->currentRiderGet)}
          | false => <div>{ReasonReact.string("No match selected")}</div> 
          }; }
        </div>
      }
      else {
        <div>
          <button
            className="button button--large"
            id="showGetRidersList" 
            onClick={handleGetRidersListClick}
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
  getRidersList: (string, string) => unit,
  hideRidersList: unit => unit,
  showCurrentRider: matchx => unit,
  hideCurrentRider: unit => unit,
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
      make(
      ~loginInfo=jsProps->loginInfoGet,
      ~apiInfo=jsProps->apiInfoGet,
      ~matchesInfo=jsProps->matchesInfoGet,
      ~getRidersList=jsProps->getRidersListGet,
      ~hideRidersList=jsProps->hideRidersListGet,
      ~showCurrentRider=jsProps->showCurrentRiderGet,
      ~hideCurrentRider=jsProps->hideCurrentRiderGet,
      [||],
    )
  );

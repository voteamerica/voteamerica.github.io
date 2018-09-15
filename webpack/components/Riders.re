let component = ReasonReact.statelessComponent("Riders");

[@bs.deriving abstract]
type rider = {
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

type tableOnClickHandler = (ReactEvent.Form.t, option( unit => unit)) => unit;

[@bs.deriving abstract]
type getTdPropsClickHandler = {
  onClick: tableOnClickHandler
};

[@bs.deriving abstract]
type riderRowInfo = {
  original: rider 
};

type getTdPropsHandler = (string, option(riderRowInfo), string, string) => getTdPropsClickHandler;

[@bs.deriving abstract]
type ridersInfo = {
  showRiderList: bool,
  riders: array(rider),
  showCurrentRiderDetails: bool,
  currentRider: (rider)
};

[@bs.deriving abstract]
type riderTableJsProps = {
  className: string,
  [@bs.as "type"] type_: string,
  columns: array(TypeInfo.theader),
  defaultPageSize: int,
  data: array(rider),
  getTdProps: getTdPropsHandler
};

let tableType = "riders";

let riderTableCol1 = TypeInfo.theader(~header="First Name", ~accessor="RiderFirstName");
let riderTableCol2 = TypeInfo.theader(~header="Email", ~accessor="RiderEmail");
let riderTableCol3 = TypeInfo.theader(~header="Last Name", ~accessor="RiderLastName");

let riderTableColumns = 
  [| 
  TypeInfo.theader(~header="uuid", ~accessor="UUID"),riderTableCol1, 
  riderTableCol2, 
  riderTableCol3,
  TypeInfo.theader(~header="Phone", ~accessor="RiderPhone"),
  TypeInfo.theader(~header="Collection ZIP", ~accessor="RiderCollectionZIP"),
  TypeInfo.theader(~header="Dropoff ZIP", ~accessor="RiderDropOffZIP"),
  TypeInfo.theader(~header="Created", ~accessor="created_ts"),
  TypeInfo.theader(~header="Updated", ~accessor="last_updated_ts"),
  TypeInfo.theader(~header="Status", ~accessor="status"),
  TypeInfo.theader(~header="Org", ~accessor="uuid_organization"),
  |];

let tableRider = itemDetails:rider => 
      rider(
        ~uuid=itemDetails->uuidGet,
        ~firstName=itemDetails->firstNameGet, ~email=itemDetails->emailGet,  ~lastName=itemDetails->lastNameGet,
        ~phone=itemDetails->phoneGet,
        ~collectionZip=itemDetails->collectionZipGet,
        ~dropOffZIP=itemDetails->dropOffZIPGet,
        ~organization=itemDetails->organizationGet,
        ~status=itemDetails->statusGet,
        ~created=itemDetails->createdGet,
        ~updated=itemDetails->updatedGet,
        );

let make = (~loginInfo:TypeInfo.loginInfo, ~apiInfo:TypeInfo.apiInfo, ~ridersInfo:ridersInfo, 
~getRidersList, 
~hideRidersList,
~showCurrentRider,
~hideCurrentRider,
_children) => {

  let ridersTdPropsHandler: getTdPropsHandler = (_state, rowInfoOption, _column, _instance) => {

    let tableClickHandler: tableOnClickHandler = (_e, handleOriginalOption) => {
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
          let sr: (rider => unit, option(rider)) => unit = [%raw (fx, itemDetails) => "{ fx(itemDetails); return 0; }"];

          let itemDetails = rowInfo->originalGet;
          let currentRider = tableRider(itemDetails);

          sr(showCurrentRider, Some(currentRider));
        }
      };

      switch handleOriginalOption {
        | None => ()
        | Some(handleOriginal) => handleOriginal()
      };

      ();
    };

    let clickHandlerObjectWrapper = getTdPropsClickHandler(~onClick=tableClickHandler);
    
    clickHandlerObjectWrapper;
  };

  let handleGetRiderListClick = (_event) => {
    let token = loginInfo->TypeInfo.tokenGet;
    let url = apiInfo->TypeInfo.apiUrlGet;

    /* NOTE: without this step, dispatch prop does not work correctly - best to use typed version of bs raw section, in part because dispatch prop is optimised out of the function if not referenced in some way */
    let gl: ((string, string) => unit, string, string) => unit = [%raw (fx, url, token) => "{ fx(url, token); return 0; }"];

    gl(getRidersList, url, token);

    ();
  };

  let handleHideRiderListClick = (_event) => {
    /* NOTE: if the jsProps type is correct, a (unit => unit) dispatch prop function can be called directly */
    hideRidersList();

    ();
  };

  {
  ...component,
  render: (_self) => { 
    let tableRiders:array(rider) = Array.map(tableRider, ridersInfo->ridersGet); 

    let tableDivStyle = ReactDOMRe.Style.make(~marginTop="20px", ~marginBottom="10px", ());

    let currentRiderInfo = currentRider => {
      <div>
        <h3>{ReasonReact.string("Current rider info:")}</h3>
        <div>{ReasonReact.string(currentRider->firstNameGet ++ " " ++ currentRider->lastNameGet) }
        </div>
        <div>{ReasonReact.string(currentRider->emailGet)}
        </div>
      </div>
    };

    let tableRidersJSX = 
      if (ridersInfo->showRiderListGet) {
        <div>
          <button
            className="button button--large"
            id="hideGetRidersList" 
            onClick={handleHideRiderListClick}
          >{ReasonReact.string("Hide List")}
          </button>
          <div style={tableDivStyle}> 
            <Table propsCtr={riderTableJsProps}  className="basicRiderTable" type_={tableType} columns={riderTableColumns}
            data=tableRiders
            getTdProps={ridersTdPropsHandler}
            />
          </div>
          {switch (ridersInfo->showCurrentRiderDetailsGet) {
          | true => {currentRiderInfo(ridersInfo->currentRiderGet)}
          | false => <div>{ReasonReact.string("No rider selected")}</div> 
          }; }
        </div>
      }
      else {
        <div>
          <button
            className="button button--large"
            id="showGetRidersList" 
            onClick={handleGetRiderListClick}
          >{ReasonReact.string("Show Riders List")}
          </button>
        </div>
      };

    let ridersInfoArea = 
      if (loginInfo->TypeInfo.loggedInGet) {
        <div>
          <h2 className="operator-page-heading">{ReasonReact.string("Rider Info")}</h2>
          <div>        
            {tableRidersJSX}
          </div>
        </div>
      }
      else {
        ReasonReact.null;
      };

    <div> 
      {ridersInfoArea}
    </div>
  }
}};

[@bs.deriving abstract]
type jsProps = {
  loginInfo: TypeInfo.loginInfo,
  apiInfo: TypeInfo.apiInfo,
  ridersInfo: ridersInfo,  
  getRidersList: (string, string) => unit,
  hideRidersList: unit => unit,
  showCurrentRider: rider => unit,
  hideCurrentRider: unit => unit,
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
      make(
      ~loginInfo=jsProps->loginInfoGet,
      ~apiInfo=jsProps->apiInfoGet,
      ~ridersInfo=jsProps->ridersInfoGet,
      ~getRidersList=jsProps->getRidersListGet,
      ~hideRidersList=jsProps->hideRidersListGet,
      ~showCurrentRider=jsProps->showCurrentRiderGet,
      ~hideCurrentRider=jsProps->hideCurrentRiderGet,
      [||],
    )
  );

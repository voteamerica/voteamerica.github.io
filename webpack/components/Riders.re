let component = ReasonReact.statelessComponent("Riders");

[@bs.deriving abstract]
type rider = {
   [@bs.as "DriverFirstName"] firstName: string,
   [@bs.as "DriverEmail"] email: string,
   [@bs.as "DriverLastName"] lastName: string
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
  showRidersList: bool,
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

let riderTableCol1 = TypeInfo.theader(~header="First Name", ~accessor="DriverFirstName");
let riderTableCol2 = TypeInfo.theader(~header="Email", ~accessor="DriverEmail");
let riderTableCol3 = TypeInfo.theader(~header="Last Name", ~accessor="DriverLastName");

let riderTableColumns = 
  [| riderTableCol1, 
  riderTableCol2, 
  riderTableCol3 
  |];

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
          let sr: (rider => unit, option(rider)) => unit = [%raw (fx, riderDetails) => "{ fx(riderDetails); return 0; }"];

          let currentRiderFirstName =rowInfo->originalGet->firstNameGet;

          let currentRider = rider(~firstName=currentRiderFirstName, ~email=rowInfo->originalGet->emailGet,  ~lastName=rowInfo->originalGet->lastNameGet);

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
    let tableRider = riderDetails:rider => 
      rider(~firstName=riderDetails->firstNameGet, ~email=riderDetails->emailGet,  ~lastName=riderDetails->lastNameGet);

    let tableRiders:array(rider) = Array.map(tableRider, ridersInfo->ridersGet); 

    let tableDivStyle = ReactDOMRe.Style.make(~marginTop="20px", ~marginBottom="10px", ());

    let currentRiderInfo = currentRider => {
      <div>{ReasonReact.string("Current rider info")}
        <div>{ReasonReact.string(currentRider->firstNameGet ++ " " ++ currentRider->lastNameGet) }
        </div>
        <div>{ReasonReact.string(currentRider->emailGet)}
        </div>
      </div>
    };

    let tableRidersJSX = 
      if (ridersInfo->showRidersListGet) {
        <div>
          <button
            className="button button--large"
            id="hideGetRidersList" 
            onClick={handleHideDriversListClick}
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
            /* onClick={self.handle(handleGetRidersListClick)} */
            onClick={handleGetRidersListClick}
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

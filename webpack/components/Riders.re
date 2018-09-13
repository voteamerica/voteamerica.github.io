let component = ReasonReact.statelessComponent("Riders");

[@bs.deriving abstract]
type rider = {
   [@bs.as "DriverFirstName"] firstName: string,
   [@bs.as "DriverEmail"] email: string,
   [@bs.as "DriverLastName"] lastName: string
};

[@bs.deriving abstract]
type ridersInfo = {
  showRidersList: bool,
  riders: array(rider)
};

[@bs.deriving abstract]
type riderTableJsProps = {
  className: string,
  [@bs.as "type"] type_: string,
  columns: array(TypeInfo.theader),
  defaultPageSize: int,
  data: array(rider),
  onClick: ReactEvent.Mouse.t => unit,
  getTdProps: TypeInfo.getTdPropsHandler
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

let ridersTdPropsHandler: TypeInfo.getTdPropsHandler = (state, rowInfo, column, instance) => {
  Js.log("click");
  Js.log(state);
  Js.log(rowInfo);
  Js.log(column);
  Js.log(instance);

  let fxx: TypeInfo.tableOnClickHandler = (e, handleOriginal) => {
    Js.log(state);
    Js.log(rowInfo);
    Js.log(column);
    Js.log(instance);

    Js.log(ReactEvent.Form.target(e));

    Js.log(handleOriginal);

    switch handleOriginal {
      | None => ()
      | Some(fn) => fn()
    };

    ();
  };

  let clickHandlerObjectWrapper = TypeInfo.getTdPropsClickHandler(~onClick=fxx);
  
  clickHandlerObjectWrapper;
};

let make = (~loginInfo:TypeInfo.loginInfo, ~apiInfo:TypeInfo.apiInfo, ~ridersInfo:ridersInfo, 
~getRidersList, 
~hideRidersList,
_children) => {

  let handleTableClick = (_event, _self) => {    
    Js.log(_event);

    ();
  };

  let handleGetRidersListClick = (_event, _self) => {
    let token = loginInfo->TypeInfo.tokenGet;
    let url = apiInfo->TypeInfo.apiUrlGet;

    /* NOTE: without this step, dispatch prop does not work correctly - best to use typed version of bs raw section, in part because dispatch prop is optimised out of the function if not referenced in some way */
    let gl: ((string, string) => unit, string, string) => unit = [%raw (fx, url, token) => "{ fx(url, token); return 0; }"];

    gl(getRidersList, url, token);

    ();
  };

  let handleHideDriversListClick = (_event, _self) => {
    /* NOTE: if the jsProps type is correct, a (unit => unit) dispatch prop function can be called directly */
    hideRidersList();

    ();
  };

  {
  ...component,
  render: (self) => { 
    let tableRider = riderDetails:rider => 
      rider(~firstName=riderDetails->firstNameGet, ~email=riderDetails->emailGet,  ~lastName=riderDetails->lastNameGet);

    let tableRiders:array(rider) = Array.map(tableRider, ridersInfo->ridersGet); 

    let tableDivStyle = ReactDOMRe.Style.make(~marginTop="20px", ~marginBottom="10px", ());

    let tableRidersJSX = 
      if (ridersInfo->showRidersListGet) {
        <div>
          <button
            className="button button--large"
            id="hideGetRidersList" 
            onClick={self.handle(handleHideDriversListClick)}
          >{ReasonReact.string("Hide List")}
          </button>
          <div style={tableDivStyle}> 
            <Table propsCtr={riderTableJsProps}  className="basicRiderTable" type_={tableType} columns={riderTableColumns}
            data=tableRiders
            onClick={self.handle(handleTableClick)}
            getTdProps={ridersTdPropsHandler}
            />
          </div>
        </div>
      }
      else {
        <div>
          <button
            className="button button--large"
            id="showGetRidersList" 
            onClick={self.handle(handleGetRidersListClick)}
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
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
      make(
      ~loginInfo=jsProps->loginInfoGet,
      ~apiInfo=jsProps->apiInfoGet,
      ~ridersInfo=jsProps->ridersInfoGet,
      ~getRidersList=jsProps->getRidersListGet,
      ~hideRidersList=jsProps->hideRidersListGet,
      [||],
    )
  );

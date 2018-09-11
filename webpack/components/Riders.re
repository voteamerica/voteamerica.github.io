let component = ReasonReact.statelessComponent("Riders");

let tableType = "riders";

let t1 = TypeInfo.theader(~header="First Name", ~accessor="DriverFirstName");
let t2 = TypeInfo.theader(~header="Email", ~accessor="DriverEmail");
let t3 = TypeInfo.theader(~header="Last Name", ~accessor="DriverLastName");

let tableColumns = [| t1, t2, t3 |];

let make = (~loginInfo:TypeInfo.loginInfo, ~apiInfo:TypeInfo.apiInfo, ~ridersInfo:TypeInfo.ridersInfo, 
~getRidersList, 
~hideRidersList,
_children) => {
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
    let tableRider = 
      rider => TypeInfo.rider(~firstName=rider->TypeInfo.firstNameGet, ~email=rider->TypeInfo.emailGet,  ~lastName=rider->TypeInfo.lastNameGet); 

    let tableRiders = Array.map(tableRider, ridersInfo->TypeInfo.ridersGet); 

    let tableDivStyle = ReactDOMRe.Style.make(~marginTop="20px", ~marginBottom="10px", ());

    let tableRidersJSX = 
      if (ridersInfo->TypeInfo.showRidersListGet) {
        <div>
          <button
            className="button button--large"
            id="hideGetRidersList" 
            onClick={self.handle(handleHideDriversListClick)}
          >{ReasonReact.string("Hide List")}
          </button>
          <div style={tableDivStyle}> 
            <Table propsCtr={TypeInfo.riderTableJsProps}  className="123" type_={tableType} columns={tableColumns}
            data=tableRiders
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
  ridersInfo: TypeInfo.ridersInfo,  
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

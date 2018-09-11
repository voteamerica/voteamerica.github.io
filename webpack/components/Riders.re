let component = ReasonReact.statelessComponent("Riders");

let tableType = "123";

let t1 = TypeInfo.theader(~header="First Name", ~accessor="DriverFirstName");
let t2 = TypeInfo.theader(~header="Email", ~accessor="DriverEmail");
let t3 = TypeInfo.theader(~header="Last Name", ~accessor="DriverLastName");

/* [@bs.deriving abstract] */
    /* type person = {
      age: int,
      namex: string
    }; */

/* 
  let me: person = {age: 20, namex: "Big Reason"};

  let mn = me.namex; */

let make = (~loginInfo:TypeInfo.loginInfo, ~apiInfo:TypeInfo.apiInfo, ~ridersInfo:TypeInfo.ridersInfo, 
~getRidersList, 
~hideRidersList,
_children) => {
  let handleGetRidersListClick = (_event, _self) => {

    let token = loginInfo->TypeInfo.tokenGet;

    let url = apiInfo->TypeInfo.apiUrlGet;

    Js.log(getRidersList);

    /* for now, this is the most straightforward way to handle the action creator prop */
    let getList = [%raw {| 
      function (url, token) {
            getRidersList(url, token);

            return (1);
      }
      |}];

    let z = getList(url, token);

    Js.log(z);
  };

  {
  ...component,
  render: (self) => { 
    let tableRider = 
      rider => TypeInfo.rider(~firstName=rider->TypeInfo.firstNameGet, ~email=rider->TypeInfo.emailGet,  ~lastName=rider->TypeInfo.lastNameGet); 

    let tableRiders = Array.map(tableRider, ridersInfo->TypeInfo.ridersGet); 

    /* let tableRiderTis =     
      rider => TypeInfo.R(TypeInfo.rider(~firstName=rider->TypeInfo.firstNameGet, ~email=rider->TypeInfo.emailGet,  ~lastName=rider->TypeInfo.lastNameGet));

    let tableRidersTis = Array.map(tableRiderTis, ridersInfo->TypeInfo.ridersGet); 

    Js.log(tableRidersTis); */

    let tableDivStyle = ReactDOMRe.Style.make(~marginTop="20px", ~marginBottom="10px", ());

    /*             onClick={this.handleHideDriversListClick(this)}
 */
    let tableRidersJSX = 
      if (ridersInfo->TypeInfo.showRidersListGet) {
        <div>
          <button
            className="button button--large"
            id="hideGetRidersList"
          >{ReasonReact.string("Hide List")}
          </button>
          <div style={tableDivStyle}> 
            <Table propsCtr={TypeInfo.riderTableJsProps}  className="123" type_={tableType} columns=[|t1, t2, t3|] 
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
        <div>{ReasonReact.string("no riders info while not logged in")}</div>
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
  getRidersList: (string, string) => string,
  hideRidersList: (string, string) => string,
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

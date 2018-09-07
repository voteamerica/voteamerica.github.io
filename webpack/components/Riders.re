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

/* underscores before names indicate unused variables. We name them for clarity */
let make = (~loginInfo:TypeInfo.loginInfo,  ~ridersInfo:TypeInfo.ridersInfo, _children) => {
  ...component,
  render: (_self) =>{ 
    let x: int = (Array.length (ridersInfo->TypeInfo.ridersGet));
    let s:string = 
      if (x == 0) {
        "0";
      }
      else {
        let r: TypeInfo.rider = ridersInfo->TypeInfo.ridersGet[0];

        r->TypeInfo.firstNameGet;
      };

    let buttonx = <button> {ReasonReact.string("Hello " ++ s)} </button>;

    /* let name = r => r->TypeInfo.firstNameGet;    
    let names = Array.map(name, riders);  */

    let tableRider = rider => TypeInfo.rider(~firstName= rider->TypeInfo.firstNameGet, ~email=rider->TypeInfo.emailGet,  ~lastName=rider->TypeInfo.lastNameGet);
    
    let tableRiders = Array.map(tableRider, ridersInfo->TypeInfo.ridersGet); 

    let tableRiders = 
      if (ridersInfo->TypeInfo.showRidersListGet) {
        <Table className="123" type_={tableType} columns=[|t1, t2, t3|] data=tableRiders />

      }
      else {
        <div>{ReasonReact.string("not showing riders")}</div>
      };

    let ridersInfoArea = 
      if (loginInfo->TypeInfo.loggedInGet) {
    <div>
      <div>
        {buttonx}
      </div>
      <div>{ReasonReact.string("tablexxx")}
      </div>
      <div>        
        {tableRiders}
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
};

[@bs.deriving abstract]
type jsProps = {
  loginInfo: TypeInfo.loginInfo,
  ridersInfo: TypeInfo.ridersInfo
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
      make(
      ~loginInfo=jsProps->loginInfoGet,
      ~ridersInfo=jsProps->ridersInfoGet,
      [||],
    )
  );

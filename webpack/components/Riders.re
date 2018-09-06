let component = ReasonReact.statelessComponent("Riders");

let tableType = "123";

let t1 = Table.theader(~header="First Name", ~accessor="DriverFirstName");
let t2 = Table.theader(~header="Email", ~accessor="DriverEmail");
let t3 = Table.theader(~header="Last Name", ~accessor="DriverLastName");


/* underscores before names indicate unused variables. We name them for clarity */
let make = ( ~riders, _children) => {
  ...component,
  render: (_self) =>{ 
    let x: int = (Array.length (riders));
    let s = 
      if (x == 0) {
        "0";
      }
      else {
        riders[0];
      }
    
    /* string_of_int(x); */

    let buttonx = <button> {ReasonReact.string("Hello " ++ s)} </button>;

    <div>
      <div>
        {buttonx}
      </div>
      <div>{ReasonReact.string("tablexxx")}
      </div>
      <div>
        <Table className="123" type_={tableType} columns=[|t1, t2, t3|] />
      </div>
  </div>
  }
};

[@bs.deriving abstract]
type jsProps = {
  riders: array( string)
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(
      ~riders=jsProps->ridersGet,
      [||],
    )
  );

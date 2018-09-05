let component = ReasonReact.statelessComponent("Riders");

let tableType = "123";

let t1 = Table.theader(~header="First Name", ~accessor="DriverFirstName");
let t2 = Table.theader(~header="Email", ~accessor="DriverEmail");
let t3 = Table.theader(~header="Last Name", ~accessor="DriverLastName");


/* underscores before names indicate unused variables. We name them for clarity */
let make = ( ~riders, _children) => {
  ...component,
  render: (_self) => 
    <div>
      <div>
        <button> {ReasonReact.string("Hello " ++ riders)} </button>
      </div>
      <div>{ReasonReact.string("tablexxx")}
      </div>
      <div>
        <Table className="123" type_={tableType} columns=[|t1, t2, t3|] />
      </div>
    </div>
};

[@bs.deriving abstract]
type jsProps = {
  riders: string
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(
      ~riders=jsProps->ridersGet,
      [||],
    )
  );

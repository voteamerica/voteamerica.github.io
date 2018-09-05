let component = ReasonReact.statelessComponent("Riders");

let x = "123"

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
        <Table className="123" type_={x} columns=[||] />
      </div>
    </div>
};

/* 
      <div><Table className="123" type="1" />
      </div>

      className="123" type={1}
*/

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

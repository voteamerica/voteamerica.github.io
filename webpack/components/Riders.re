let component = ReasonReact.statelessComponent("Riders");

/* underscores before names indicate unused variables. We name them for clarity */
let make = ( ~riders, _children) => {
  ...component,
  render: (_self) => <button> {ReasonReact.string("Hello " ++ riders)} </button>
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
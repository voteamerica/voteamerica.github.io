let component = ReasonReact.statelessComponent("Greeting");

/* underscores before names indicate unused variables. We name them for clarity */
let make = (~name, _children) => {
  ...component,
  render: (_self) => <button> {ReasonReact.string("Hello " ++ name)} </button>
};

[@bs.deriving abstract]
type jsProps = {
  name: string
};

let jsComponent =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(
      ~name=jsProps->nameGet,
      [||],
    )
  );
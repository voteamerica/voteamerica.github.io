let component = ReasonReact.statelessComponent("Greeting");

/* underscores before names indicate unused variables. We name them for clarity */
let make = (_children) => {
  ...component,
  render: (_self) => <button> {ReasonReact.string("Hello " ++ "!")} </button>
};

let default =
  ReasonReact.wrapReasonForJs(~component, (_) =>
    make(
      [||],
    )
  );
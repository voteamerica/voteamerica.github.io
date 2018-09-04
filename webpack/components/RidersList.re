let component = ReasonReact.statelessComponent("CompList");

let listItems = [1, 2, 3];

let fx = item => <li> (ReasonReact.string(string_of_int(item))) </li>;

let items = Array.map(fx, [|1, 2, 3|]);

let x = () => <li> (ReasonReact.string("aaa")) </li>;

let y = () => <li />;

let make = (_) => {
  ...component,
  render: (_) => <div> <ul> (ReasonReact.array(items)) </ul> </div>
}; /* render: s => <div> <ul> (x()) (y()) </ul> </div> */

let default =
  ReasonReact.wrapReasonForJs(~component, (_) =>
    make(
      [||],
    )
  );
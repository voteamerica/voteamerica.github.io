let component = ReasonReact.statelessComponent("RidersList");

let listItems = [1, 2, 3];

let fx = item => {

  let itemString = string_of_int(item);

  <li key={itemString}> {ReasonReact.string(itemString)} </li>
};

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
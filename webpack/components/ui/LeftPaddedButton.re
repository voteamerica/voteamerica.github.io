[@bs.deriving abstract]
type leftPaddedButtonProps = {
  className: string,
  id: string,
  onClick: unit => unit
};

[@bs.module "./LeftPaddedButton.jsx"]
external buttonItems : ReasonReact.reactClass = "default";

let make = (~props, ~className, ~id, ~onClick, children) => {
  ReasonReact.wrapJsForReason(
    ~reactClass=buttonItems,
    ~props=props(~className, ~id, ~onClick),
    children
  )};

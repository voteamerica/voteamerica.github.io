[@bs.deriving abstract]
type jsProps = {
  /* some example fields */
  className: string,
  /* `type` is reserved in Reason. use `type_` and make it still compile to the
    JS key `type` */
  [@bs.as "type"] type_: string,
  /* value: Js.nullable(int), */
};

/* [@bs.module] external tableWrap : ReasonReact.reactClass = "./TableWrap.jsx"; */

/* [@bs.module] external reactTable : ReasonReact.reactClass = "react-table"; */

/* https://github.com/reasonml/reason-react/blob/master/docs/element-type-is-invalid.md */
[@bs.module "react-table"] external reactTable : ReasonReact.reactClass = "default";

/* let make = (~className, ~type_, ~value=?, children) => */
let make = (~className, ~type_, children) =>
  ReasonReact.wrapJsForReason(
    /* ~reactClass=tableWrap, */
    ~reactClass=reactTable,
    ~props=jsProps(
      ~className,
      ~type_,
      /* ~value=Js.Nullable.fromOption(value), */
    ),    
    children,
  );

  
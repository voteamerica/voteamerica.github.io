[@bs.deriving abstract]
type theader = {
  [@bs.as "Header"] header: string, 
  accessor: string
};

[@bs.deriving abstract]
type jsProps = {
  /* some example fields */
  className: string,
  /* `type` is reserved in Reason. use `type_` and make it still compile to the
    JS key `type` */
  [@bs.as "type"] type_: string,
  /* value: Js.nullable(int), */
  columns: array(theader),
  defaultPageSize: int,
  data: array(string)
};

/* [@bs.module] external tableWrap : ReasonReact.reactClass = "./TableWrap.jsx"; */

/* https://github.com/reasonml/reason-react/blob/master/docs/element-type-is-invalid.md */
/* [@bs.module] external reactTable : ReasonReact.reactClass = "react-table"; */
[@bs.module "react-table"] external reactTable : ReasonReact.reactClass = "default";

let make = (~className, ~type_, ~columns,  children) =>
  ReasonReact.wrapJsForReason(
    /* ~reactClass=tableWrap, */
    ~reactClass=reactTable,
    ~props=jsProps(
      ~className,
      ~type_,    
      ~columns,
      ~defaultPageSize=5,
      ~data=[||]
    ),    
    children,
  );

  
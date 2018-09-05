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
};

/* [@bs.module] external tableWrap : ReasonReact.reactClass = "./TableWrap.jsx"; */

/* https://github.com/reasonml/reason-react/blob/master/docs/element-type-is-invalid.md */
/* [@bs.module] external reactTable : ReasonReact.reactClass = "react-table"; */
[@bs.module "react-table"] external reactTable : ReasonReact.reactClass = "default";

let t1 = theader(~header="First Name", ~accessor="DriverFirstName");
let t2 = theader(~header="Email", ~accessor="DriverEmail");
let t3 = theader(~header="Last Name", ~accessor="DriverLastName");

let make = (~className, ~type_, ~columns,  children) =>
  ReasonReact.wrapJsForReason(
    /* ~reactClass=tableWrap, */
    ~reactClass=reactTable,
    ~props=jsProps(
      ~className,
      ~type_,    
      ~columns=[|t1, t2, t3|],
    ),    
    children,
  );

  
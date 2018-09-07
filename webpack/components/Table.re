
/* [@bs.module] external tableWrap : ReasonReact.reactClass = "./TableWrap.jsx"; */

/* https://github.com/reasonml/reason-react/blob/master/docs/element-type-is-invalid.md */
/* [@bs.module] external reactTable : ReasonReact.reactClass = "react-table"; */
[@bs.module "react-table"] external reactTable : ReasonReact.reactClass = "default";

let make = (~className, ~type_, ~columns, ~data, children) =>{

  ReasonReact.wrapJsForReason(
    /* ~reactClass=tableWrap, */
    ~reactClass=reactTable,
    ~props=TypeInfo.riderTableJsProps(
      ~className,
      ~type_,    
      ~columns,
      ~defaultPageSize=5,
      ~data,
    ),    
    children,
  )};

  
/* [@bs.module] external tableWrap : ReasonReact.reactClass = "./TableWrap.jsx"; */

/* https://github.com/reasonml/reason-react/blob/master/docs/element-type-is-invalid.md */
/* [@bs.module] external reactTable : ReasonReact.reactClass = "react-table"; */
[@bs.module "react-table"]
external reactTable : ReasonReact.reactClass = "default" /* This table supports the display of different data types. The first param is a JsProps constructor, for which the data field is the type of the data to display, e.g. rider or driver */;

let make =
    (
      ~props,
      ~className,
      ~type_,
      ~defaultPageSize /* ~page,  */,
      ~pageSize,
      ~filterable,
      ~columns,
      ~data,
      ~onPageChange,
      ~onPageSizeChange,
      ~getTdProps,
      children,
    ) =>
  ReasonReact.wrapJsForReason(
    /* ~reactClass=tableWrap, */
    ~reactClass=reactTable,
    ~props=
      props(
        ~className,
        ~type_,
        ~columns,
        ~defaultPageSize /* ~page, */,
        ~pageSize,
        ~filterable,
        ~data,
        ~onPageChange,
        ~onPageSizeChange,
        ~getTdProps,
      ),
    children,
  );
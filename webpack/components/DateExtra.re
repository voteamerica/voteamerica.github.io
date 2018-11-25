/* [@bs.module] external tableWrap : ReasonReact.reactClass = "./TableWrap.jsx"; */

/* https://github.com/reasonml/reason-react/blob/master/docs/element-type-is-invalid.md */
/* [@bs.module] external reactTable : ReasonReact.reactClass = "react-table"; */
[@bs.module "./DateExtra.jsx"]
external dateExtra : ReasonReact.reactClass = "default" /* This table supports the display of different data types. The first param is a JsProps constructor, for which the data field is the type of the data to display, e.g. rider or driver */;

let make =
    (
      ~props,
      ~id,
      ~className,
      ~type_,
      ~name,
      ~value,
      ~required,
      ~onChange,
      children,
    ) =>
  ReasonReact.wrapJsForReason(
    /* ~reactClass=tableWrap, */
    ~reactClass=dateExtra,
    ~props=
      props(
        ~id,
        ~className,
        ~type_,
        ~name,
        ~value,
        ~required,
        ~onChange,
      ),
    children,
  );
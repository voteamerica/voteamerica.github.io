
/* [@bs.module] external tableWrap : ReasonReact.reactClass = "./TableWrap.jsx"; */

/* https://github.com/reasonml/reason-react/blob/master/docs/element-type-is-invalid.md */
/* [@bs.module] external reactTable : ReasonReact.reactClass = "react-table"; */
[@bs.module "react-table"] external reactTable : ReasonReact.reactClass = "default";

/* This table supports the display of different data types. The first param is a JsProps constructor, for which the data field is the type of the data to display, e.g. rider or driver */
let make = (~propsCtr, ~className, ~type_, ~columns, ~data, ~onClick, children) =>{

  ReasonReact.wrapJsForReason(
    /* ~reactClass=tableWrap, */
    ~reactClass=reactTable,
    ~props=propsCtr(
      ~className,
      ~type_,    
      ~columns,
      ~defaultPageSize=5,
      ~data,
      ~onClick,
      ~getTdProps = (state, rowInfo, x, y) => {
        Js.log("click");
        Js.log(state);
        Js.log(rowInfo);
        Js.log(x);
        Js.log(y);

        /* : ((unit) => ((string, string) => unit))  */

        let gl: (string, string, string, string) => TypeInfo.getTdPropsClickHandler = [%raw (state, rowInfo, x, y) => " return { onClick: (e, handleOriginal) => { console.log('clicked!'); if (handleOriginal) { handleOriginal(); } } }; "];

        /*  */

        let x = gl(state, rowInfo, x, y);

        x;

        /* gl; */
        }
    ),    
    children,
  )};

    /* ~handleTableClick= unit => { */
      /* ~onClick= unit => {
    ();
      },

    */
  
[@bs.val] external encodeURI: string => string = "encodeURI";

[@bs.deriving abstract]
type driver = {
   [@bs.as "DriverFirstName"] driverFirstName: string,
};

let unitArgAction: (unit => unit) => unit = [%raw fx => "{ fx(); return 0; }"];

let stringArgAction: (string => unit, string) => unit = [%raw
  (fx, urlBlob) => "{ fx(urlBlob); return 0; }"
];

type tableOnPageChangeHandler = int => unit;
type tableOnPageChangeSizeHandler = (int, int) => unit;

type tableOnClickHandler = (ReactEvent.Form.t, option( unit => unit)) => unit;

[@bs.deriving abstract]
type getTdPropsClickHandler = {
  onClick: tableOnClickHandler
};

[@bs.deriving abstract]
type getTdPropsClickHandlerAndStyle = {
  onClick: tableOnClickHandler,
  style: ReactDOMRe.style,
};

[@bs.deriving abstract]
type loginInfoDetails = {
  username: string
};

[@bs.deriving abstract]
type loginInfo = {
  loggedIn: bool,
  token: string,
  details: loginInfoDetails
};

[@bs.deriving abstract]
type apiInfo = {
  apiUrl: string 
};

[@bs.deriving abstract]
type theader = {
  [@bs.as "Header"] header: string, 
  accessor: string, 
};

type cellValueToStringHandler = unit => string;

[@bs.deriving abstract]
type theaderCell = {
  [@bs.as "Header"] header: string, 
  accessor: string, 
  [@bs.as "Cell"] cell: cellValueToStringHandler, 
};

[@bs.deriving abstract]
type driverTableJsProps = {
  className: string,
  /* `type` is reserved in Reason. use `type_` and make it still compile to the
    JS key `type` */
  [@bs.as "type"] type_: string,
  columns: array(theader),
  defaultPageSize: int,
  data: array(driver)
};

/* [@bs.deriving abstract]
type tableBaseJsProps = {
  className: string, */
  /* `type` is reserved in Reason. use `type_` and make it still compile to the
    JS key `type` */
/*  [@bs.as "type"] type_: string,
  columns: array(theader),
  defaultPageSize: int,
}; */

/* this compiles, but couldn't use it for table props */
/* type tbItem ('a) = TI ('a);

type riderTableItem = TI rider;
type driverTableItem = TI driver; */

/* seems a reasonable compromise, but do need both constructor and type */
/* type tableItem = | R(rider) | D(driver); */

/* this works, but prefer extra info for type being already defined */
/* type tisTest = 
  | RT( string, string  ) 
  | DT(driver); */

/* [@bs.deriving abstract]
type xriderTableJsProps = {
  base: tableBaseJsProps,
  data: array(rider)
}; */

/* type xyz = X | Y | Z;

type xyzz = [`X | `Y | `Z]; */



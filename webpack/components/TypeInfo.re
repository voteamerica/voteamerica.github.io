[@bs.deriving abstract]
type rider = {
   [@bs.as "DriverFirstName"] firstName: string,
   [@bs.as "DriverEmail"] email: string,
   [@bs.as "DriverLastName"] lastName: string
};

[@bs.deriving abstract]
type driver = {
   [@bs.as "DriverFirstName"] driverFirstName: string,
};

[@bs.deriving abstract]
type riderTest = {
   namex: string
};

[@bs.deriving abstract]
type loginInfo = {
  loggedIn: bool,
  token: string,
};

[@bs.deriving abstract]
type apiInfo = {
  apiUrl: string 
};

[@bs.deriving abstract]
type ridersInfo = {
  showRidersList: bool,
  riders: array(rider)
};

[@bs.deriving abstract]
type theader = {
  [@bs.as "Header"] header: string, 
  accessor: string
};

type tableOnClickHandler = (ReactEvent.Form.t, unit => unit) => unit;

[@bs.deriving abstract]
type getTdPropsClickHandler = {
  /* [@bs.as "onClick"] onClick: string, */
  onClick: tableOnClickHandler
};

/* this compiles, but couldn't use it for table props */
type tbItem ('a) = TI ('a);

type riderTableItem = TI rider;
type driverTableItem = TI driver;

/* seems a reasonable compromise, but do need both constructor and type */
type tableItem = | R(rider) | D(driver);

/* this works, but prefer extra info for type being already defined */
/* type tisTest = 
  | RT( string, string  ) 
  | DT(driver); */

[@bs.deriving abstract]
type tableBaseJsProps = {
  className: string,
  /* `type` is reserved in Reason. use `type_` and make it still compile to the
    JS key `type` */
  [@bs.as "type"] type_: string,
  columns: array(theader),
  defaultPageSize: int,
};

[@bs.deriving abstract]
type xriderTableJsProps = {
  base: tableBaseJsProps,
  data: array(rider)
};

[@bs.deriving abstract]
type riderTableJsProps = {
  className: string,
  /* `type` is reserved in Reason. use `type_` and make it still compile to the
    JS key `type` */
  [@bs.as "type"] type_: string,
  columns: array(theader),
  defaultPageSize: int,
  data: array(rider),
  onClick: ReactEvent.Mouse.t => unit,
  getTdProps: (string, string, string, string) => getTdPropsClickHandler
};

/*
  getTdProps: (string, string, string, string) => unit
*/

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

type xyz = X | Y | Z;

type xyzz = [`X | `Y | `Z];



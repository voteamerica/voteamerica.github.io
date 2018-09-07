[@bs.deriving abstract]
type rider = {
   [@bs.as "DriverFirstName"] firstName: string,
   [@bs.as "DriverEmail"] email: string,
   [@bs.as "DriverLastName"] lastName: string
};

[@bs.deriving abstract]
type riderTest = {
   namex: string
};


/*  */

[@bs.deriving abstract]
type theader = {
  [@bs.as "Header"] header: string, 
  accessor: string
};

[@bs.deriving abstract]
type riderTableJsProps = {
  /* some example fields */
  className: string,
  /* `type` is reserved in Reason. use `type_` and make it still compile to the
    JS key `type` */
  [@bs.as "type"] type_: string,
  /* value: Js.nullable(int), */
  columns: array(theader),
  defaultPageSize: int,
  data: array(rider)
};

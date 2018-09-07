let component = ReasonReact.statelessComponent("Riders");

let tableType = "123";

let t1 = TypeInfo.theader(~header="First Name", ~accessor="DriverFirstName");
let t2 = TypeInfo.theader(~header="Email", ~accessor="DriverEmail");
let t3 = TypeInfo.theader(~header="Last Name", ~accessor="DriverLastName");

/* let r1 = TypeInfo.rider(~name="Name1"); */

/* [@bs.deriving abstract] */
    type person = {
      age: int,
      namex: string
    };

/* underscores before names indicate unused variables. We name them for clarity */
let make = ( ~riders:array(TypeInfo.rider), _children) => {
  ...component,
  render: (_self) =>{ 
    let x: int = (Array.length (riders));
    let s:string = 
      if (x == 0) {
        "0";
      }
      else {
        let r: TypeInfo.rider = riders[0];


        /* let w = r##name; */

        /* "1" */
        
       

        /* r.name */
        /* r##DriverFirstName */
        /* r->TypeInfo.DriverFirstNameGet */
        /* TypeInfo.nameGet(r) */
        r->TypeInfo.firstNameGet
        /* r->DriverFirstNameGet */
        /* r->TypeInfo.tGet; */

        /* TypeInfo.tGet(r) */
      };

    /* let r3: TypeInfo.riderTest = TypeInfo.riderTest(~name="Last Name"); */
    /* let r3: TypeInfo.riderTest = {name: "Last Name"}; */

    /* let rt: TypeInfo.riderTest = TypeInfo.riderTest(~name="test"); */


    let me: person = {age: 20, namex: "Big Reason"};

    let mn = me.namex;


    /* let s = r3.name; */
    
    /* string_of_int(x); */

    let buttonx = <button> {ReasonReact.string("Hello " ++ s)} </button>;

    let name = r => r->TypeInfo.firstNameGet;    
    
    let names = Array.map(name, riders); 

    /* let dataInfo = riders; */
      let r1 = TypeInfo.rider(~firstName= "r1", ~email="e1",  ~lastName="t1");
  let r2 = TypeInfo.rider(~firstName= "r2", ~email="e2",  ~lastName="t2");

    /* let dataInfo = [||]; */
    let dataInfo = [|r1, r2|];



    <div>
      <div>
        {buttonx}
      </div>
      <div>{ReasonReact.string("tablexxx")}
      </div>
      <div>
        <Table className="123" type_={tableType} columns=[|t1, t2, t3|] data=dataInfo />
      </div>
  </div>
  }
};

[@bs.deriving abstract]
type jsProps = {
  riders: array(TypeInfo.rider)
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(
      ~riders=jsProps->ridersGet,
      [||],
    )
  );

let component = ReasonReact.statelessComponent("Riders");

[@bs.deriving abstract]
type rider = {
   [@bs.as "UUID"] uuid: string,
   [@bs.as "RiderFirstName"] firstName: string,
   [@bs.as "RiderEmail"] email: string,
   [@bs.as "RiderLastName"] lastName: string,
   [@bs.as "RiderPhone"] phone: string,
   [@bs.as "RiderCollectionZIP"] collectionZip: string,
   city: string,
   full_state: string,
   [@bs.as "RiderDropOffZIP"] dropOffZIP: string,
   [@bs.as "AvailableRideTimesLocal"] rideTimesLocal: string,
   [@bs.as "TotalPartySize"] partySize: string,
   [@bs.as "TwoWayTripNeeded"] twoWayTrip: bool,
   [@bs.as "RiderIsVulnerable"] riderVulnerable: bool,
   [@bs.as "RiderWillNotTalkPolitics"] noPoliticsTalk: bool,
   [@bs.as "PleaseStayInTouch"] stayInTouch: bool,
   [@bs.as "NeedWheelchair"] needWheelchair: bool,
   [@bs.as "RiderPreferredContact"] contactMethod: bool,
   [@bs.as "RiderAccommodationNotes"] riderNotes: bool,
   [@bs.as "RiderLegalConsent"] legalConsent: bool,
   [@bs.as "ReadyToMatch"] readyToMatch: bool,
   [@bs.as "created_ts"] created: string,
   [@bs.as "last_updated_ts"] updated: string,
   status_info: string,
   [@bs.as "RiderWillBeSafe"] willBeSafe: bool,
   [@bs.as "RiderCollectionStreetNumber"] collectionStreetNumber: string,
   [@bs.as "RiderCollectionAddress"] collectionAddress: string,
   [@bs.as "RiderDestinationAddress"] destinationAddress: string,
    status: string,
   uuid_organization: string,
   [@bs.as "OrganizationName"] organizationName: string,
   timezone: string,
};

[@bs.deriving abstract]
type riderRowInfo = {
  original: rider 
};

type riderGetTdPropsHandler = (string, option(riderRowInfo), string, string) => TypeInfo.getTdPropsClickHandlerAndStyle;

[@bs.deriving abstract]
type ridersInfo = {
  showRiderList: bool,
  riders: array(rider),
  listPageIndex: int,
  listPageSize: int,
  showCurrentRiderDetails: bool,
  currentRider: (rider),  
};

[@bs.deriving abstract]
type riderTableJsProps = {
  className: string,
  [@bs.as "type"] type_: string,
  columns: array(TypeInfo.theaderCell),
  defaultPageSize: int,
  pageSize: int,
  data: array(rider),
  onPageChange: TypeInfo.tableOnPageChangeHandler,
  onPageSizeChange: TypeInfo.tableOnPageChangeSizeHandler,
  getTdProps: riderGetTdPropsHandler
};

let tableType = "riders";

let riderTableColumns = 
  [| 
  TypeInfo.thcCreator(~header="uuid", ~accessor="UUID"),
  TypeInfo.thcCreator(~header="First Name", ~accessor="RiderFirstName"), 
  TypeInfo.thcCreator(~header="Last Name", ~accessor="RiderLastName"),
  TypeInfo.thcCreator(~header="Email", ~accessor="RiderEmail"), 
  TypeInfo.thcCreator(~header="Phone", ~accessor="RiderPhone"),
  TypeInfo.thcCreator(~header="Collection ZIP", ~accessor="RiderCollectionZIP"),
  TypeInfo.thcCreator(~header="City", ~accessor="city"),
  TypeInfo.thcCreator(~header="State", ~accessor="full_state"),
  TypeInfo.thcCreator(~header="Dropoff ZIP", ~accessor="RiderDropOffZIP"),
  TypeInfo.thcCreator(~header="Created", ~accessor="created_ts"),
  TypeInfo.thcCreator(~header="Updated", ~accessor="last_updated_ts"),
  TypeInfo.thcCreator(~header="Status", ~accessor="status"),
  TypeInfo.thcCreator(~header="Status Info", ~accessor="status_info"),
  TypeInfo.thcCreator(~header="Org ID", ~accessor="uuid_organization"),
  TypeInfo.thcCreator(~header="Org Name", ~accessor="OrganizationName"),
   TypeInfo.thcCreator(~header="Collection Street Number", ~accessor="RiderCollectionStreetNumber"),
   TypeInfo.thcCreator(~header="Collection Address", ~accessor="RiderCollectionAddress"),
   TypeInfo.thcCreator(~header="Destination Address", ~accessor="RiderDestinationAddress"),
   TypeInfo.thcCreator(~header="Ride Times Local", ~accessor="AvailableRideTimesLocal"), 
   TypeInfo.thcCreator(~header="Party Size", ~accessor="TotalPartySize"),
   TypeInfo.thcCreatorBool(~header="Two Way Trip", ~accessor="TwoWayTripNeeded"),
   TypeInfo.thcCreatorBool(~header="Is Vulnerable", ~accessor="RiderIsVulnerable"),
   TypeInfo.thcCreatorBool(~header="No Politics Talk", ~accessor="RiderWillNotTalkPolitics"),
   TypeInfo.thcCreatorBool(~header="Stay In Touch", ~accessor="PleaseStayInTouch"),
   TypeInfo.thcCreatorBool(~header="Need Wheelchair", ~accessor="NeedWheelchair"),
   TypeInfo.thcCreator(~header="Contact Method", ~accessor="RiderPreferredContact"),
   TypeInfo.thcCreator(~header="Rider Notes", ~accessor="RiderAccommodationNotes"),
   TypeInfo.thcCreatorBool(~header="Legal Consent", ~accessor="RiderLegalConsent"),
   TypeInfo.thcCreatorBool(~header="Ready To Match", ~accessor="ReadyToMatch"),
   TypeInfo.thcCreatorBool(~header="Will Be Safe", ~accessor="RiderWillBeSafe"),
   TypeInfo.thcCreator(~header="Time zone", ~accessor="timezone"),
  |];

let tableRider = itemDetails:rider => 
      rider(
        ~uuid=itemDetails->uuidGet,
        ~firstName=itemDetails->firstNameGet, 
        ~email=itemDetails->emailGet,  
        ~lastName=itemDetails->lastNameGet,
        ~phone=itemDetails->phoneGet,
        ~collectionZip=itemDetails->collectionZipGet,
        ~city=itemDetails->cityGet,
        ~full_state=itemDetails->full_stateGet,
        ~dropOffZIP=itemDetails->dropOffZIPGet,
        ~uuid_organization=itemDetails->uuid_organizationGet,
        ~status=itemDetails->statusGet,
        ~created=itemDetails->createdGet,
        ~updated=itemDetails->updatedGet,
        ~rideTimesLocal=itemDetails->rideTimesLocalGet,
        ~twoWayTrip=itemDetails->twoWayTripGet,
        ~partySize=itemDetails->partySizeGet,
        ~riderVulnerable=itemDetails->riderVulnerableGet,
        ~noPoliticsTalk=itemDetails->noPoliticsTalkGet,
        ~stayInTouch=itemDetails->stayInTouchGet,
        ~needWheelchair=itemDetails->needWheelchairGet,
        ~contactMethod=itemDetails->contactMethodGet,
        ~riderNotes=itemDetails->riderNotesGet,
        ~legalConsent=itemDetails->legalConsentGet,
        ~readyToMatch=itemDetails->readyToMatchGet,
        ~status_info=itemDetails->status_infoGet,
        ~willBeSafe=itemDetails->willBeSafeGet,
        ~collectionStreetNumber=itemDetails->collectionStreetNumberGet,
        ~collectionAddress=itemDetails->collectionAddressGet,
        ~destinationAddress=itemDetails->destinationAddressGet,
        ~organizationName=itemDetails->organizationNameGet,
        ~timezone=itemDetails->timezoneGet,
        );

let make = (~loginInfo:TypeInfo.loginInfo, ~apiInfo:TypeInfo.apiInfo, 
~ridersInfo:ridersInfo,
~matchesInfo:Matches.matchesInfo, 
~getRidersList, 
~hideRidersList,
~setInfoRidersList,
~showCurrentRider,
~hideCurrentRider,
_children) => {

  let ridersTableOnPageChangeHandler: TypeInfo.tableOnPageChangeHandler = (pageIndex) => {
    Js.log(pageIndex);
  };

  let ridersTableOnPageChangeSizeHandler: TypeInfo.tableOnPageChangeSizeHandler = (size, _index) => {
    Js.log(size);

    let pageIndex = ridersInfo->listPageIndexGet;

    /* NOTE: without this step, dispatch prop does not work correctly - best to use typed version of bs raw section, in part because dispatch prop is optimised out of the function if not referenced in some way */
    let f: ((int, int) => unit, int, int) => unit = [%raw (fx, index, size) => "{ fx(index, size); return 0; }"];

    f(setInfoRidersList, pageIndex, size);
  };

  let ridersTdPropsHandler: riderGetTdPropsHandler = (_state, rowInfoOption, _column, _instance) => {
    let itemUuid = switch (rowInfoOption) {
    | None => ""
    | Some(rowInfo) => rowInfo->originalGet->uuidGet
    };

    let tableClickHandler: TypeInfo.tableOnClickHandler = (_e, handleOriginalOption) => {
      /* Js.log(ReactEvent.Form.target(e)); */
      /* Js.log(handleOriginal); */

      switch (rowInfoOption) {
      | None => {
          /* NOTE: if the jsProps type is correct, a (unit => unit) dispatch prop function can be called directly */
          hideCurrentRider();

          ();
      }
      | Some(rowInfo) => {
          Js.log(rowInfo); 

          /* NOTE: without this step, dispatch prop does not work correctly - best to use typed version of bs raw section, in part because dispatch prop is optimised out of the function if not referenced in some way */
          let sr: (rider => unit, option(rider)) => unit = [%raw (fx, itemDetails) => "{ fx(itemDetails); return 0; }"];

          let itemDetails = rowInfo->originalGet;

          let currentRider = tableRider(itemDetails);

          sr(showCurrentRider, Some(currentRider));
        }
      };

      switch handleOriginalOption {
        | None => ()
        | Some(handleOriginal) => handleOriginal()
      };

      ();
    };

    let getRowBkgColour = () => {
      if (itemUuid == matchesInfo->Matches.currentMatchGet->Matches.uuid_riderGet) {
        TypeInfo.highlightMatchedRowBackgroundColour
      }
      else 
      if ( itemUuid == ridersInfo->currentRiderGet->uuidGet) { 
        TypeInfo.highlightSelectedRowBackgroundColour
      }
      else { 
        TypeInfo.defaultRowBackgroundColour
      }
    };

    let getRowTextColour = () => {
        if ( itemUuid == ridersInfo->currentRiderGet->uuidGet) { 
          TypeInfo.highlightSelectedRowForegroundColour
        }
        else { 
          TypeInfo.defaultRowForegroundColour
        }
    };

    let bkgStyle = ReactDOMRe.Style.make(~background=getRowBkgColour(), ~color=getRowTextColour(), ());

    let clickHandlerAndStyleObjectWrapper = TypeInfo.getTdPropsClickHandlerAndStyle(~onClick=tableClickHandler, ~style=bkgStyle);
    
    clickHandlerAndStyleObjectWrapper;
  };

  let handleGetRiderListClick = (_event) => {
    let token = loginInfo->TypeInfo.tokenGet;
    let url = apiInfo->TypeInfo.apiUrlGet;

    /* NOTE: without this step, dispatch prop does not work correctly - best to use typed version of bs raw section, in part because dispatch prop is optimised out of the function if not referenced in some way */
    let gl: ((string, string) => unit, string, string) => unit = [%raw (fx, url, token) => "{ fx(url, token); return 0; }"];

    gl(getRidersList, url, token);

    ();
  };

  let handleHideRiderListClick = (_event) => {
    /* NOTE: if the jsProps type is correct, a (unit => unit) dispatch prop function can be called directly */
    hideRidersList();

    ();
  };

  {
  ...component,
  render: (_self) => { 
    let tableRiders:array(rider) = Array.map(tableRider, ridersInfo->ridersGet); 

    let tableDivStyle = ReactDOMRe.Style.make(~marginTop="20px", ~marginBottom="10px", ());

    let currentRiderInfo = currentRider => {
      let uriPhone = TypeInfo.encodeURI(currentRider->phoneGet);

      let selfServiceUrl = "../self-service/?type=rider&uuid=" ++ currentRider->uuidGet ++ "&code=0&info&phone=" ++ uriPhone;

      <div>
        <h3>{ReasonReact.string("Current rider info:")}</h3>
        <div>{ReasonReact.string(currentRider->firstNameGet ++ " " ++ currentRider->lastNameGet) }
        </div>
        <div>{ReasonReact.string(currentRider->emailGet)}
        </div>
        <div>
          <a href={selfServiceUrl}>{ReasonReact.string( "Self Service Page")}</a>
        </div>
      </div>
    };

    let tableRidersJSX = 
      if (ridersInfo->showRiderListGet) {
        <div>
          <div> 
            <button
              className="button button--large"
              id="hideRidersListButton" 
              onClick={handleHideRiderListClick}
            >{ReasonReact.string("Hide List")}
            </button>
            <LeftPaddedButton props={LeftPaddedButton.leftPaddedButtonProps} className="button button--large" id="refreshRidersListButton" onClick={handleGetRiderListClick} >{ReasonReact.string("Refresh List")}</LeftPaddedButton>
          </div> 
          <div style={tableDivStyle}> 
            <Table props={riderTableJsProps}  className="basicRiderTable" type_={tableType} columns={riderTableColumns}
            defaultPageSize={5} /* get this from types default */
            pageSize={ridersInfo->listPageSizeGet}
            data=tableRiders
            onPageChange={ridersTableOnPageChangeHandler}
            onPageSizeChange={ridersTableOnPageChangeSizeHandler}
            getTdProps={ridersTdPropsHandler}
            />
          </div>
          {switch (ridersInfo->showCurrentRiderDetailsGet) {
          | true => {currentRiderInfo(ridersInfo->currentRiderGet)}
          | false => <div>{ReasonReact.string("No rider selected")}</div> 
          }; }
        </div>
      }
      else {
        <div>
          <button
            className="button button--large"
            id="showGetRidersList" 
            onClick={handleGetRiderListClick}
          >{ReasonReact.string("Show Riders List")}
          </button>
        </div>
      };

    let ridersInfoArea = 
      if (loginInfo->TypeInfo.loggedInGet) {
        <div>
          <h2 className="operator-page-heading">{ReasonReact.string("Rider Info")}</h2>
          <div>        
            {tableRidersJSX}
          </div>
        </div>
      }
      else {
        ReasonReact.null;
      };

    <div> 
      {ridersInfoArea}
    </div>
  }
}};

[@bs.deriving abstract]
type jsProps = {
  loginInfo: TypeInfo.loginInfo,
  apiInfo: TypeInfo.apiInfo,
  ridersInfo: ridersInfo,  
  matchesInfo: Matches.matchesInfo,
  getRidersList: (string, string) => unit,
  hideRidersList: unit => unit,
  setInfoRidersList: (int, int) => unit,
  showCurrentRider: rider => unit,
  hideCurrentRider: unit => unit,
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
      make(
      ~loginInfo=jsProps->loginInfoGet,
      ~apiInfo=jsProps->apiInfoGet,
      ~ridersInfo=jsProps->ridersInfoGet,
      ~matchesInfo=jsProps->matchesInfoGet,
      ~getRidersList=jsProps->getRidersListGet,
      ~hideRidersList=jsProps->hideRidersListGet,
      ~setInfoRidersList=jsProps->setInfoRidersListGet,
      ~showCurrentRider=jsProps->showCurrentRiderGet,
      ~hideCurrentRider=jsProps->hideCurrentRiderGet,
      [||],
    )
  );

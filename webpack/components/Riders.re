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
   state: string,
   [@bs.as "RiderDropOffZIP"] dropOffZIP: string,
   [@bs.as "AvailableRideTimesLocal"] rideTimesLocal: string,
   [@bs.as "TotalPartySize"] partySize: int,
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
  showDownloadLink: bool,
  urlDownloadBlob: string,
  riders: array(rider),
  listPageIndex: int,
  listPageSize: int,
  hideExpiredCanceled: bool,
  hideConfirmed: bool,
  showCurrentMatchRiderOnly: bool,
  showCurrentRiderDetails: bool,
  currentRider: (rider),  
};

[@bs.deriving abstract]
type riderTableJsProps = {
  className: string,
  [@bs.as "type"] type_: string,
  columns: array(TypeInfo.theaderCell),
  defaultPageSize: int,
  /* page: int, */
  pageSize: int,
  filterable: bool,
  data: array(rider),
  onPageChange: TypeInfo.tableOnPageChangeHandler,
  onPageSizeChange: TypeInfo.tableOnPageChangeSizeHandler,
  getTdProps: riderGetTdPropsHandler
};

let tableType = "riders";

let riderTableColumns = 
  [| 
    Utils.thcCreator(~header="uuid", ~accessor="UUID", ~width=100),
    Utils.thcCreator(~header="First Name", ~accessor="RiderFirstName", ~width=100),
    Utils.thcCreator(~header="Last Name", ~accessor="RiderLastName", ~width=100),
    Utils.thcCreator(~header="Email", ~accessor="RiderEmail", ~width=100),
    Utils.thcCreator(~header="Phone", ~accessor="RiderPhone", ~width=100),
    Utils.thcCreator(~header="Collection ZIP", ~accessor="RiderCollectionZIP", ~width=100),
    Utils.thcCreator(~header="City", ~accessor="city", ~width=100),
    Utils.thcCreator(~header="State", ~accessor="full_state", ~width=100),
    Utils.thcCreator(~header="StateShort", ~accessor="state", ~width=100),
    Utils.thcCreator(~header="Dropoff ZIP", ~accessor="RiderDropOffZIP", ~width=100),
    Utils.thcCreator(~header="Created", ~accessor="created_ts", ~width=160),
    Utils.thcCreator(~header="Updated", ~accessor="last_updated_ts", ~width=160),
    Utils.thcCreator(~header="Status", ~accessor="status", ~width=100),
    Utils.thcCreator(~header="Status Info", ~accessor="status_info", ~width=100),
    Utils.thcCreator(~header="Org ID", ~accessor="uuid_organization", ~width=100),
    Utils.thcCreator(~header="Org Name", ~accessor="OrganizationName", ~width=100),
    Utils.thcCreator(~header="Collection Street Number", ~accessor="RiderCollectionStreetNumber", ~width=100),
    Utils.thcCreator(~header="Collection Address", ~accessor="RiderCollectionAddress", ~width=100),
    Utils.thcCreator(~header="Destination Address", ~accessor="RiderDestinationAddress", ~width=100),
    Utils.thcCreator(~header="Ride Times Local", ~accessor="AvailableRideTimesLocal", ~width=160), 
    Utils.thcCreator(~header="Party Size", ~accessor="TotalPartySize", ~width=100),
    Utils.thcCreatorBool(~header="Two Way Trip", ~accessor="TwoWayTripNeeded", ~width=100),
    Utils.thcCreatorBool(~header="Is Vulnerable", ~accessor="RiderIsVulnerable", ~width=100),
    Utils.thcCreatorBool(~header="No Politics Talk", ~accessor="RiderWillNotTalkPolitics", ~width=100),
    Utils.thcCreatorBool(~header="Stay In Touch", ~accessor="PleaseStayInTouch", ~width=100),
    Utils.thcCreatorBool(~header="Need Wheelchair", ~accessor="NeedWheelchair", ~width=100),
    Utils.thcCreator(~header="Contact Method", ~accessor="RiderPreferredContact", ~width=135),
    Utils.thcCreator(~header="Rider Notes", ~accessor="RiderAccommodationNotes", ~width=100),
    Utils.thcCreatorBool(~header="Legal Consent", ~accessor="RiderLegalConsent", ~width=100),
    Utils.thcCreatorBool(~header="Ready To Match", ~accessor="ReadyToMatch", ~width=100),
    Utils.thcCreatorBool(~header="Will Be Safe", ~accessor="RiderWillBeSafe", ~width=100),
    Utils.thcCreator(~header="Time zone", ~accessor="timezone", ~width=100)
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
        ~state=itemDetails->stateGet,
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

[@bs.deriving abstract]
type jsProps = {
  loginInfo: TypeInfo.loginInfo,
  apiInfo: TypeInfo.apiInfo,
  ridersInfo: ridersInfo,  
  matchesInfo: Matches.matchesInfo,
  getRidersList: (string, string) => unit,
  hideRidersList: unit => unit,
  showRidersListDownloadLink: string => unit,
  hideRidersListDownloadLink: unit => unit,
  setInfoRidersList: (int, int) => unit,
  hideExpiredRidersList: unit => unit,
  hideConfirmedRidersList: unit => unit,
  showCurrentMatchOnlyRidersList: unit => unit,
  showCurrentRider: rider => unit,
  hideCurrentRider: unit => unit,
};

let make = (~loginInfo:TypeInfo.loginInfo, ~apiInfo:TypeInfo.apiInfo, 
~ridersInfo:ridersInfo,
~matchesInfo:Matches.matchesInfo, 
~getRidersList, 
~hideRidersList,
~showRidersListDownloadLink,
~hideRidersListDownloadLink,
~setInfoRidersList,
~hideExpiredRidersList,
~hideConfirmedRidersList,
~showCurrentMatchOnlyRidersList,
~showCurrentRider,
~hideCurrentRider,
_children) => {

  let ridersTableOnPageChangeHandler: TypeInfo.tableOnPageChangeHandler = (pageIndex) => {
    let pageSize = ridersInfo->listPageSizeGet;

    Utils.setInfoJs(setInfoRidersList, pageIndex, pageSize);
  };

  let ridersTableOnPageChangeSizeHandler: TypeInfo.tableOnPageChangeSizeHandler = (size, pageIndex) => {
    Utils.setInfoJs(setInfoRidersList, pageIndex, size);
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
          TypeInfo.unitArgAction(hideCurrentRider);

          ();
      }
      | Some(rowInfo) => {
          /* Js.log(rowInfo);  */

          /* NOTE: without this step, dispatch prop does not work correctly - best to use typed version of bs raw section, in part because dispatch prop is optimised out of the function if not referenced in some way */
          let sr: (rider => unit, option(rider)) => unit = [%raw (fx, itemDetails) => "{ fx(itemDetails); return 0; }"];

          let itemDetails = rowInfo->originalGet;

          let currentRider = tableRider(itemDetails);

          sr(showCurrentRider, Some(currentRider));
        }
      };

      /* with bs 4.0.7 js functions with no params need to be called in this way. Before, they could be called directly, although it was different for functions with parameters */
      switch handleOriginalOption {
        | None => ()
        | Some(handleOriginal) => TypeInfo.unitArgAction(handleOriginal)
      };

      ();
    };

    let getRowBkgColour = () => {
      if (itemUuid == matchesInfo->Matches.currentMatchGet->Matches.uuid_riderGet) {
        Defaults.highlightMatchedRowBackgroundColour
      }
      else 
      if ( itemUuid == ridersInfo->currentRiderGet->uuidGet) { 
        Defaults.highlightSelectedRowBackgroundColour
      }
      else { 
        Defaults.defaultRowBackgroundColour
      }
    };

    let getRowTextColour = () => {
        if ( itemUuid == ridersInfo->currentRiderGet->uuidGet) { 
          Defaults.highlightSelectedRowForegroundColour
        }
        else { 
          Defaults.defaultRowForegroundColour
        }
    };

    let bkgStyle = ReactDOMRe.Style.make(~background=getRowBkgColour(), ~color=getRowTextColour(), ());

    let clickHandlerAndStyleObjectWrapper = TypeInfo.getTdPropsClickHandlerAndStyle(~onClick=tableClickHandler, ~style=bkgStyle);
    
    clickHandlerAndStyleObjectWrapper;
  };

  let ridersTableHideExpiredHandler = _ => {
    TypeInfo.unitArgAction(hideExpiredRidersList);

    ();
  }

  let ridersTableHideConfirmedHandler = _ => {
    TypeInfo.unitArgAction(hideConfirmedRidersList);

    ();
  }

  let ridersTableShowCurrentMatchRiderOnlyHandler = _ => {
    TypeInfo.unitArgAction(showCurrentMatchOnlyRidersList);

    ();
  }

  let handleGetRiderListClick = (_event) => {
    let token = loginInfo->TypeInfo.tokenGet;
    let url = apiInfo->TypeInfo.apiUrlGet;

    /* NOTE: without this step, dispatch prop does not work correctly - best to use typed version of bs raw section, in part because dispatch prop is optimised out of the function if not referenced in some way */
    let gl: ((string, string) => unit, string, string) => unit = [%raw (fx, url, token) => "{ fx(url, token); return 0; }"];

    gl(getRidersList, url, token);

    ();
  };

  let handleHideRiderListClick = (_event) => {
    TypeInfo.unitArgAction(hideRidersList);

    ();
  };

  let handleShowRidersListDownloadLinkClick = (_event) => {
    let tableRidersAll:array(rider) = Array.map(tableRider, ridersInfo->ridersGet); 

    let createBlob: array(rider) => string = [%raw (riders) => "{ 
      const jsonr = JSON.stringify(riders);
      const blob = new Blob([jsonr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      return url; }"];

    let urlBlob: string = createBlob(tableRidersAll);

    TypeInfo.stringArgAction(showRidersListDownloadLink, urlBlob);

    ();
  };

  let handleHideRidersListDownloadLinkClick = (_event) => {
    TypeInfo.unitArgAction(hideRidersListDownloadLink);

    ();
  };

  {
  ...component,
  render: (_self) => { 
    let filterExpiredRiders = riders => {
      if (ridersInfo->hideExpiredCanceledGet === true) {
        let filterRiders = rider => rider->statusGet !== "Expired" && rider->statusGet !== "Canceled";

        let ridersNotExpired = Utils.filterArray(~f=filterRiders, riders);
          
        ridersNotExpired;
      }
      else {
        riders;
      };
    };

    let filterConfirmedRiders = riders => {
      if (ridersInfo->hideConfirmedGet === true) {
        let filterRiders = rider => rider->statusGet !== "MatchConfirmed";

        let ridersNotConfirmed = Utils.filterArray(~f=filterRiders, riders);
          
        ridersNotConfirmed;
      }
      else {
        riders;
      };
    };

    let tableRidersAll:array(rider) = Array.map(tableRider, ridersInfo->ridersGet); 

    let tableRidersStepOne = filterExpiredRiders(tableRidersAll);
    let tableRidersStepTwo = filterConfirmedRiders(tableRidersStepOne);

    let filterCurrentMatchRiderOnly = riders => {
      if (ridersInfo->showCurrentMatchRiderOnlyGet == true){
        let filterRiders = rider => rider->uuidGet == matchesInfo->Matches.currentMatchGet->Matches.uuid_riderGet;

        let ridersCurrentMatchOnly = Utils.filterArray(~f=filterRiders, riders);
          
        ridersCurrentMatchOnly;
      }
      else {
        riders;
      }; 
    };

    let tableRiders = filterCurrentMatchRiderOnly(tableRidersStepTwo);

    let tableDivStyle = ReactDOMRe.Style.make(~marginTop="20px", ~marginBottom="10px", ());

    let checkboxAreaStyle = ReactDOMRe.Style.make(~marginTop="20px", ~display="inline-block", ());

    let checkboxLabelStyle = ReactDOMRe.Style.make(~paddingRight="40px", ());

    let currentRiderItemDivStyle = ReactDOMRe.Style.make(~marginBottom="10px",());

    let currentRiderItemSpanStyle = ReactDOMRe.Style.make(
    ~marginLeft="10px", ()
    );

    let downloadLinkButtonSpanStyle = ReactDOMRe.Style.make(
    ~marginLeft="130px", ()
    );

    let downloadLinkAnchorStyle = ReactDOMRe.Style.make(
    ~marginLeft="15px", ()
    );

    let currentRiderInfo = currentRider => {
      let uriPhone = TypeInfo.encodeURI(currentRider->phoneGet);

      let selfServiceUrl = "../self-service/?type=rider&uuid=" ++ currentRider->uuidGet ++ "&code=0&info&phone=" ++ uriPhone;

      <div>
        <h3>{ReasonReact.string("Current rider info:")}</h3>
        
        <div style={currentRiderItemDivStyle}>
          <span style={currentRiderItemSpanStyle}>{ReasonReact.string(currentRider->firstNameGet ++ " " ++ currentRider->lastNameGet) }
          </span>
          <span style={currentRiderItemSpanStyle}>{ReasonReact.string(currentRider->emailGet)}
          </span>
          {
            switch currentRider->needWheelchairGet {
            | true => {
          <span style={currentRiderItemSpanStyle}>{ReasonReact.string("Powerchair user")}
          </span>}
            | false => ReasonReact.null
            };
           }
           {
            switch (currentRider->partySizeGet > 1) {
              | true => {
                  <span>              
                    <span style={currentRiderItemSpanStyle}>    {ReasonReact.string("Party size: ")}
                    </span>
                    <span style={currentRiderItemSpanStyle}>
                    <strong>
                      {ReasonReact.string(string_of_int(currentRider->partySizeGet))}
                    </strong>                    
                    </span>
                  </span>
                }   
              | false => ReasonReact.null
            }
          }
        </div>        
        <div style={currentRiderItemDivStyle}><span style={currentRiderItemSpanStyle}>
          <a href={selfServiceUrl}>{ReasonReact.string( "Self Service Page")}</a></span>
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
            {switch (ridersInfo->showDownloadLinkGet) {
              | true => <span style={downloadLinkButtonSpanStyle}>
                <LeftPaddedButton props={LeftPaddedButton.leftPaddedButtonProps} className="button button--large" id="hideRidersListDownloadLinkButton" onClick={handleHideRidersListDownloadLinkClick} >{ReasonReact.string("Hide Download Link")}</LeftPaddedButton>
                <a style={downloadLinkAnchorStyle} className="button button--large" download={loginInfo->TypeInfo.detailsGet->TypeInfo.usernameGet ++ " - riders - backup.json"} href={ridersInfo->urlDownloadBlobGet}>
                  {ReasonReact.string("Download backup")}
                </a>
              </span>
              | false => <span style={downloadLinkButtonSpanStyle}> <LeftPaddedButton props={LeftPaddedButton.leftPaddedButtonProps} className="button button--large" id="showRidersListDownloadLinkButton" onClick={handleShowRidersListDownloadLinkClick} >{ReasonReact.string("Show Download Link")}</LeftPaddedButton></span>}
            }
          </div>
          <div> 
            <div className="form-group checkbox" style={checkboxAreaStyle}>
              <label className="" style={checkboxLabelStyle} htmlFor="hideExpired">{ReasonReact.string("Hide Expired/Cancelled")}
              </label>
              <input className="" type_="checkbox" id="hideExpired" checked={ridersInfo->hideExpiredCanceledGet} onChange={ridersTableHideExpiredHandler} />
            </div> 
            <div className="form-group checkbox" style={checkboxAreaStyle}>
              <label className="" style={checkboxLabelStyle} htmlFor="hideConfirmed">{ReasonReact.string("Hide Confirmed")}
              </label>
              <input className="" type_="checkbox" id="hideConfirmed" checked={ridersInfo->hideConfirmedGet} onChange={ridersTableHideConfirmedHandler} />
            </div> 
            <div className="form-group checkbox" style={checkboxAreaStyle}>
              <label className="" style={checkboxLabelStyle} htmlFor="showCurrentMatchRiderOnly">{ReasonReact.string("Show Current Match Rider Only")}
              </label>
              <input className="" type_="checkbox" id="showCurrentMatchRiderOnly" checked={ridersInfo->showCurrentMatchRiderOnlyGet} onChange={ridersTableShowCurrentMatchRiderOnlyHandler} />
            </div> 
          </div> 
          <div style={tableDivStyle}> 
            <Table props={riderTableJsProps}  className="basicRiderTable" type_={tableType} columns={riderTableColumns}
            defaultPageSize={5} /* get this from types default */
            pageSize={ridersInfo->listPageSizeGet}
            filterable={true}
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

/*   page={ridersInfo->listPageIndexGet}
 */

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
      make(
      ~loginInfo=jsProps->loginInfoGet,
      ~apiInfo=jsProps->apiInfoGet,
      ~ridersInfo=jsProps->ridersInfoGet,
      ~matchesInfo=jsProps->matchesInfoGet,
      ~getRidersList=jsProps->getRidersListGet,
      ~hideRidersList=jsProps->hideRidersListGet,
      ~showRidersListDownloadLink=jsProps->showRidersListDownloadLinkGet,
      ~hideRidersListDownloadLink=jsProps->hideRidersListDownloadLinkGet,
      ~setInfoRidersList=jsProps->setInfoRidersListGet,
      ~hideExpiredRidersList=jsProps->hideExpiredRidersListGet,
      ~hideConfirmedRidersList=jsProps->hideConfirmedRidersListGet,
      ~showCurrentMatchOnlyRidersList=jsProps->showCurrentMatchOnlyRidersListGet,
      ~showCurrentRider=jsProps->showCurrentRiderGet,
      ~hideCurrentRider=jsProps->hideCurrentRiderGet,
      [||],
    )
  );

//create the map, set the zoom, add it to the 'map' div element
    var map = L.map('map')
        .setView([36, -93], 3);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 3,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
        
//create the geocoder
    new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.OpenStreetMap(),
        position: 'topleft',
        showMarker: true,
        retainZoomLevel: false,
    }).addTo(map);

//data location
    var csvrider = "/carpool-map/data/unmatched-rider.csv";
    var csvdriver = "/carpool-map/data/unmatched-driver.csv";


//create a geojson layer from the csv file, .addTo(map) turns these layers on by default
//credits to Mapbox for Omnivore methods
    var omniParseRider = omnivore.csv(csvrider)
    .on('ready', function() {
        // when this is fired, the layer
        // is done being initialized
    })
    .on('error', function() {
        // fired if the layer can't be loaded over AJAX
        // or can't be parsed
    })
    .addTo(map);
    
    var omniParseDriver = omnivore.csv(csvdriver)
    .on('ready', function() {
    })
    .on('error', function() {
    })
    .addTo(map);
    
<!-- load these layers into a group for the layer control -->
    var overlayGroup = L.layerGroup([omniParseRider, omniParseDriver]);
    
<!-- create "label": key for layers -->    
    var overlaylabels = {
        "Riders": omniParseRider,
        "Drivers": omniParseDriver,
    };
    
<!-- load the label, then the layer from the layer group -->
<!-- loads the map controller, using the .addTo(map) method when creating the layer initially determines if on/off at start-->
    L.control.layers(null, overlaylabels).addTo(map);
<!-- create the map, set the zoom, add it to the 'map' div element -->
    var map = L.map('map')
        .setView([36, -93], 3);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibGFuZ2Rvbm1zIiwiYSI6ImNpZmQxdzE1dzRyd2RzbWx4bnp2Ym5maDcifQ.mrTKjuh7OcKwTDWc95OlZQ', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(map);
        
<!-- create the geocoder -->
    new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.OpenStreetMap(),
        position: 'topleft',
        showMarker: true,
        retainZoomLevel: false,
    }).addTo(map);

<!-- data location-->
    var csvrider = "/carpool-map/data/unmatched-rider.csv";
    var csvdriver = "/carpool-map/data/unmatched-driver.csv";

<!-- create a geojson layer from the csv file, .addTo(map) turns these layers on by default-->
    var omniParseRider = omnivore.csv(csvrider).addTo(map);
    var omniParseDriver = omnivore.csv(csvdriver).addTo(map);
    
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
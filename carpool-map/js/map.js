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
        showMarker: false,
        retainZoomLevel: false,
    }).addTo(map);

//custom icons
    var riderIcon = new L.icon({
        iconUrl: '/carpool-map/img/rider_red.png',
        iconSize:     [30, 30], // size of the icon
        iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });
    
    var driverIcon = new L.icon({
        iconUrl: '/carpool-map/img/maki-car-15-blue.png',
        iconSize:     [30, 30], // size of the icon
        iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

//data location
    var jsonRider = [{"count":"1","zip":"20111","state":"VA","latitude":" 38.769697","longitude":" -77.44915","city":"Manassas","full_state":"Virginia","latitude_numeric":38.7697,"longitude_numeric":-77.4492,"latlong":{"x":38.7696952819824,"y":-77.4491500854492}}];
    var jsonDriver = [{"count":"1","zip":"20111","state":"VA","latitude":" 38.769697","longitude":" -77.44915","city":"Manassas","full_state":"Virginia","latitude_numeric":38.7697,"longitude_numeric":-77.4492,"latlong":{"x":38.7696952819824,"y":-77.4491500854492}}];

// create geoJSON layer by parsing JSON with geojson.js library
    var jsonRiderParse = GeoJSON.parse(jsonRider, {Point: ["latitude_numeric", "longitude_numeric"]});
    var jsonDriverParse = GeoJSON.parse(jsonDriver, {Point: ["latitude_numeric", "longitude_numeric"]});
    
//lot the geoJSON feaures with markesr so we can use custom icons
    var jsonRiderLayer = L.geoJSON(jsonRiderParse, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: riderIcon});
        }
    }).addTo(map);
    
    var jsonDriverLayer = L.geoJSON(jsonDriverParse, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: driverIcon});
        }
    }).addTo(map);
    
// load these layers into a group for the layer control
    var overlayGroup = L.layerGroup([jsonRiderLayer, jsonDriverLayer]);
    
//create "label": key for layers   
    var overlaylabels = {
        "Riders": jsonRiderLayer,
        "Drivers": jsonDriverLayer,
    };
//load the label, then the layer from the layer group
//loads the map controller, using the .addTo(map) method when creating the layer initially determines if on/off at start
    L.control.layers(null, overlaylabels).addTo(map);

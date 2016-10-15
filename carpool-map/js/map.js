var DRIVERS_URL = 'data/unmatched-driver.csv';
var RIDERS_URL = 'data/unmatched-rider.csv';
var LONGITUDE_COL = 'LNG';
var LATITUDE_COL = 'LAT';
var ZIP_COL = 'ZIP';
var COUNT_COL = 'COUNT';
var GRADUATED_POINT_COUNTS = [10, 20, 40, 80, 160, 320];
var RIDER_COLOR = [255, 0, 0];
var DRIVER_COLOR = [0, 0, 255];
var POINT_RADIUS_INCREMENT = 0.5;
var GEOCODE_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?apiKey=ebbeef0d2fe647b1bc32ff7fee0ee567&version=4.01';

var view, map, riderSrc, riderLyr, driverSrc, driverLyr, pop;

var helpers = [{
	getZip: function(){
		return this.get(ZIP_COL);
	},
	getCount: function(){
		return this.get(COUNT_COL) * 1;
	}
}];

function bust(){
	var timeOffset = 1000 * 60 * 15,
		bust = Math.round(new Date().getTime() / timeOffset) * timeOffset;
	return '?' + bust;
};

function radius(count){
	var r = 0, zoom = view.getZoom() - 8, mult = zoom > 0 ? zoom : 1;
	if (count == 0) {
		return r;
	}
	for (var i = 0; i < GRADUATED_POINT_COUNTS.length; i++){
		r = r + POINT_RADIUS_INCREMENT;
		if (count <= GRADUATED_POINT_COUNTS[i]){
			return mult * r;
		}
	}
	return mult * r;
};

function style(feature, color){
	return [new ol.style.Style({
		image: new ol.style.Circle({
			radius: radius(feature.getCount()),
			fill: new ol.style.Fill({
				color: 'rgba(' + color.toString() + ',0.5)'
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(' + color.toString() + ',1)',
				width: 2
			})
		})
	})];
};

view = new ol.View({center: [-8131982, 4994701], zoom: 11});

map = new ol.Map({
	target: $('#map').get(0),
	layers: [new ol.layer.Tile({source: new ol.source.OSM()})],
	view: view
});

riderSrc = new nyc.ol.source.Decorating(
	{loader: new nyc.ol.source.CsvPointFeatureLoader({
		url: RIDERS_URL + bust(),
		projection: 'EPSG:4326',
		xCol: LONGITUDE_COL,
		yCol: LATITUDE_COL
	})},
	helpers,
	{projection: 'EPSG:3857'}
);

riderLyr = new ol.layer.Vector({
	source: riderSrc,
	style: function(feature){
		return style(feature, RIDER_COLOR);
	}
});

driverSrc = new nyc.ol.source.Decorating(
	{loader: new nyc.ol.source.CsvPointFeatureLoader({
		url: DRIVERS_URL + bust(),
		projection: 'EPSG:4326',
		xCol: LONGITUDE_COL,
		yCol: LATITUDE_COL
	})},
	helpers,
	{projection: 'EPSG:3857'}
);

driverLyr = new ol.layer.Vector({
	source: driverSrc,
	style: function(feature){
		return style(feature, DRIVER_COLOR);
	}
});

map.addLayer(riderLyr);
map.addLayer(driverLyr);

pop = new nyc.ol.Popup(map);

function mapClick(event){
	var px = event.pixel, coords, zip, html = '';
	map.forEachFeatureAtPixel(px, function(feature, layer){
		var lyr = layer === riderLyr ? ' Riders' : ' Drivers';
		zip = '<b>ZIP: ' + feature.getZip() + '</b><br>';
		html += (feature.getCount() + lyr + '<br>');
		coords = feature.getGeometry().getCoordinates();
	});
	if (coords){
		$('#info').html(zip + html);
		pop.setOffset([0, -10]);
		pop.show({
			coordinates: coords,
			html: $('#info').show()
		});
	}
};

map.on('click', mapClick);

new nyc.LocationMgr({
	autoLocate: true,
	controls: new nyc.ol.control.ZoomSearch(map),
	locate: new nyc.ol.Locate(
		new vote.Geocoder(GEOCODE_URL),
		'EPSG:3857'
	),
	locator: new nyc.ol.Locator({
		map: map,
		layer: new ol.layer.Vector({source: new ol.source.Vector({})}),
		zoom: 12
	})
});

$('#ctl-z-srch input').attr({placeholder: 'Enter ZIP Code...', maxlength: 5});

$(document).ready(function(){
	$('#riders').change(function(){
		riderLyr.setVisible(this.checked);
	});
	$('#drivers').change(function(){
		driverLyr.setVisible(this.checked);
	});
});

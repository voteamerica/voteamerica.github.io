/**
 * L.Control.GeoSearch - search for an address and zoom to it's location
 * L.GeoSearch.Provider.OpenStreetMap uses openstreetmap geocoding service
 * https://github.com/smeijer/L.GeoSearch
 */
L.GeoSearch.Provider.OpenStreetMap=L.Class.extend({options:{},initialize:function(t){t=L.Util.setOptions(this,t)},GetServiceUrl:function(t){var e=L.Util.extend({q:t,format:"json"},this.options);return("https:"===location.protocol?"https:":"http:")+"//nominatim.openstreetmap.org/search"+L.Util.getParamString(e)},ParseJSON:function(t){for(var e=[],n=0;n<t.length;n++){var o=t[n].boundingbox,r=new L.LatLng(o[1],o[3]),a=new L.LatLng(o[0],o[2]);t[n].address&&(t[n].address.type=t[n].type),e.push(new L.GeoSearch.Result(t[n].lon,t[n].lat,t[n].display_name,new L.LatLngBounds([r,a]),t[n].address))}return e}});
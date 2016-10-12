var vote = vote || {};

vote.Geocoder = function(url){
	this.url = url + '&zip=';
};

vote.Geocoder.prototype = {
	url: null,
	search: function(input){
		var me = this;
		input = input.trim();
		if (input.length == 5 && !isNaN(input)){
			$.ajax({
				url: me.url + input,
				dataType: 'text',
				success: function(response) {
					response = response.split(',');
					if (response[14] == 'LOCATION_TYPE_USPS_ZIP_CODE'){
						var p =  proj4('EPSG:4326', 'EPSG:3857', [response[4], response[3]]);
						me.trigger(
							nyc.Locate.EventType.GEOCODE,
							{coordinates: p, accuracy: nyc.Geocoder.Accuracy.ZIP_CODE, type: nyc.Locate.ResultType.GEOCODE, zip: true, name: input}
						);
					}else{
						me.trigger(nyc.Locate.EventType.AMBIGUOUS, {input: input, possible: []});
					}
				},
				error: function(xhr, status, error){
					console.error('Geocoder error', [xhr, status, error]);
					me.trigger(nyc.Locate.EventType.ERROR, [xhr, status, error]);
				}
			});
		}
	}
};

nyc.inherits(vote.Geocoder, nyc.EventHandling);

// dropdown.js  
// Loads JSON data to dropdown template 

var votingDropdown = (function() {
	// grab data from csv
	// loop through and print statename in dropdown with hyperlink
	$.getJSON("res/voting-details.json", function(data) {
		var items = [];
		
		$.each(data, function(key, val) {
			items.push("<option class='state-option' id='" + key + "' value='" + val["Voter registration check"] + "' >" + val["State"] + "</option>");
		});
		
		$("<select />", {
			"class": "state-dropdown",
			"id": "state-select",
			html: items.join("")
		}).appendTo("#state-details");

		$("#state-select").change(function() {
			window.open(this.value);
		});

		
	});

	$.getJSON("res/voting-details.json", function(data) {
		var itemsb = [];
		$.each(data, function(key, val) {
			itemsb.push("<option class='state-option' id='" + key + "' value='" + val["Polling location finder"] + "' >" + val["State"] + "</option>");
		});

		$("<select />", {
			"class": "location-dropdown",
			"id": "location-select",
			html: itemsb.join("")
		}).appendTo("#location-details");

		$("#location-select").change(function() {
			window.open(this.value);
		});
    });

}());
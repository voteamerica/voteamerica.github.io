// dropdown.js  
// Loads JSON data to dropdown template 

var votingDropdown = (function() {

	// grab data from csv
	// loop through and print statename in dropdown with hyperlink
	$.getJSON("res/voting-details.json", function(data) {
		var items = [];

		$.each(data, function(key, val) {
			items.push("<li class='state-location'>" + "<a href='" + val["Voter registration check"] + "' target='_blank'  id='" + key + "' >" + val["State"] + "</a>" + "</li>");
		});

		$("<ul />", {
			"class": "state-dropdown",
			"id": "state-select",
			html: items.join("")
		}).appendTo("#state-details");

		$("#showState-a").click(function() {
			$(".overlay-a").fadeIn(500);
		});

		$("#modal-a").on("click", function() {
			$(".overlay-a").fadeOut(500);

		});

	});

	$.getJSON("res/voting-details.json", function(data) {

		var itemsb = [];

		$.each(data, function(key, val) {
			itemsb.push("<li class='state-location'>" + "<a href='" + val["Polling location finder"] + "' target='_blank'  id='" + key + "' >" + val["State"] + "</a>" + "</li>");
		});

		$("<ul />", {
			"class": "location-dropdown",
			"id": "state-select",
			html: itemsb.join("")
		}).appendTo("#location-details");

	});

	$("#showStates-b").click(function() {
		$(".overlay-b").fadeIn(500);

	});

	$("#modal-b").on("click", function() {
		$(".overlay-b").fadeOut(500);

	});

}());
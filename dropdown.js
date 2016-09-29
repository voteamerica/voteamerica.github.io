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

		$("#showRegistration").click(function() {
			$(".overlay").fadeIn(500);
		});

		$("#modalA").on("click", function() {
			$(".overlay").fadeOut(500);

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

	$("#showStates").click(function() {
		$(".overlay").fadeIn(500);

	});

	$("a.close").click(function() {
		$(".overlay").fadeOut(500);
	});

	$("#modal").on("click", function() {
		$(".overlay").fadeOut(500);

	});

}());
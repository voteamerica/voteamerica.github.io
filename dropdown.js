// dropdown.js  
// Loads JSON data to dropdown template 

var votingDropdown = (function() {
	// grab data from csv
	// loop through and print statename in dropdown with hyperlink
	$.getJSON("res/voting-details.json", function(data) {
		var items = [];
		$.each(data, function(key, val) {
			items.push("<option class='state-option' id='" + key + "' value='" + val["Polling location finder"] + "' >" + val["Voter registration check"] + "</option>");
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
}());


// dropdown.js  
// Loads JSON data to dropdown template 

var votingDropdown = (function() {

	// grab data from csv
	// loop through and print statename in dropdown with hyperlink

	function listItem(type) {
		return function (val, key) {
			return '<li class="state-dropdown__item">' + '<a href="' + val[type] + '" target="_blank"  id="' + key + '" >' + val['State'] + '</a>' + '</li>';
		}
	}

	$.getJSON('res/voting-details.json', function(data) {
		$("#state-select").html( $.map(data, listItem('RegCheck')).join('') );
		$("#location-details").html( $.map(data, listItem('LocationFinder')).join('') );
	});

}());
$(function(){
    
    // Cache jQuery selectors to improve performance

    var $forms = $('#forms'),
        $intro = $('#intro'),
        availableTimesRowTemplate = $('#available-time-row').html();


    /**
     * Trigger functions on load (triggered at end of script)
     */
    function initialise() {
        setupModernizr();
        getTimePolyfill();
        addFormToggleEvents();
        addNavLinkEvents();
        initFormValidator();
        initFormLogic();
        loadStateData();
    }

    /**
     * Modernizr is a library that checks browser support for features.
     * However we only need a little bit of it, so rather than download
     * all of it or generate a custom build, let's just fake it by writing
     * custom tests for the bits we need
     */
    function setupModernizr() {
        window.Modernizr = {
            inputtypes: {
                date: checkInputSupport('date'),
                time: checkInputSupport('time')
            }
        };
    }

    /**
     * Check whether the current browser supports an input type
     * @param  {string} type - The type of input we're checking
     * @return {boolean} True if supported, else false
     */
    function checkInputSupport(type) {
        var input = document.createElement('input');
        input.setAttribute('type',type);
        var invalidValue = 'invalid-value';
        input.setAttribute('value', invalidValue); 
        return (input.type === type) && (input.value !== invalidValue);
    }

    /**
     * If the time input type isn't supported, download the polyfill.
     * This is so that users of browsers which support it don't have to
     * download unnecessary files.
     * See https://github.com/jonstipe/time-polyfill
     */
    function getTimePolyfill() {
        if (!Modernizr.inputtypes.time) {
            $('<link>').appendTo('head').attr({
                type: 'text/css', 
                rel: 'stylesheet',
                href: 'styles/time-polyfill.css'
            });
            $.getScript('scripts/time-polyfill.min.js');
        }
    }

    /**
     * Set up event listeners for showing/hiding the forms
     */
    function addFormToggleEvents() {
        // Make the intro buttons show forms and update url hash
        $intro.on('click', '.show-form', function(e) {
            var href = $(this).attr('href');
            showForm(href);
            updateLocationHash(href, href, href);
            e.preventDefault();
        });

        // Make the ✖️ icon close the form and update url hash
        $forms.on('click', '.close-form', function(e) {
            hideForms();
            updateLocationHash('home', '/' + window.location.search, '');
            e.preventDefault();
        });

        // Add an event listener to toggle when the hash updates
        window.onpopstate = toggleFormsOnHashChange;

        // Toggle the forms on page load, in case there's already a hash in the URL
        toggleFormsOnHashChange();
    }

    /**
     * Use history.pushState to update URL while enabling back button,
     * but use location.hash as a fallback if history API is not supported.
     * @param {string} page - The state object page name
     * @param {string} url - The new history entry's URL
     * @param {string} hash - The new history entry's raw hash fallback
     */
    function updateLocationHash(page, url, hash) {
        var supportsHistoryApi =  !!(window.history && history.pushState);
        if (supportsHistoryApi) {
            history.pushState({page: page}, page, url);
        } else {
            window.location.hash = hash;
        }
    }

    /**
     * Update the forms' visibility depending on the location hash
     * (e.g. carpoolvote.com#need-ride)
     */
    function toggleFormsOnHashChange() {
        if (document.location.hash.length) {
            showForm(document.location.hash);
        } else {
            hideForms();
        }
    }

    /**
     * Show a form, hide its sibling form and the intro, and scroll to it
     * @param  {string} target - The form ID
     */
    function showForm(target) {
        $(target).slideDown(200).attr('aria-hidden','false')
            .siblings().slideUp(200).attr('aria-hidden','true');
        $intro.slideUp(200).attr('aria-hidden','true');
        scrollTo(0);
    }

    /**
     * Hide both forms, show the intro, and scroll to top
     */
    function hideForms() {
        $forms.children().slideUp(200).attr('aria-hidden','true');
        $intro.slideDown(200).attr('aria-hidden','false');
        scrollTo(0);
    }

    /**
     * Animatedly scroll to a point on the page.
     * @param {number} offset - The distance from the top
     * @param {number} duration - The animation length in milliseconds
     */
    function scrollTo(offset, duration) {
        $('html, body').animate({
            scrollTop: offset
        }, duration || 500);
    }

    /**
     * Make homepage nav links scroll to a linked section,
     * if they have a 'scroll' class
     */
    function addNavLinkEvents() {
        $('#nav-links').on('click', '.scroll', function(e) {
            var anchor = $(this).attr('href');
            scrollTo($(anchor).offset().top, 999);
            e.preventDefault();
        });
    }

    /**
     * Initialise rider/driver form validator.
     * Depends on 1000hz-bootstrap-validator, which is included separately.
     * See http://1000hz.github.io/bootstrap-validator/
     */
    function initFormValidator() {
        // Start the validator
        $forms.find('form').validator({
            // Add custom validator rules for start/end time inputs
            custom: {
                start: function($el) {
                    var endTime = $($el.data('start')).val();
                    if ($el.val() >= endTime) {
                        return 'Start time must be before the end time';
                    }
                },
                end: function($el) {
                    var startTime = $($el.data('end')).val();
                    if ($el.val() <= startTime) {
                        return 'End time must be after the start time';
                    }
                }
            }
        });

        // Update both start AND end time validation when you change one of them.
        // This is so that (for example) if you set the start time after the end time,
        // but then update the end time to fix it, it will remove
        // the start time's validation message.
        $forms.on('change', 'input[type="time"]', function(){
            // Use the element's start/end data attribute to select its sibling
            var sibling = $(this).data('start') || $(this).data('end');
            // We need to use a different event ('input' instead of 'change')
            // to prevent a recursive trigger loop
            $(sibling).trigger('input');
        });
    }

    /**
     * Handle rider/driver signup form behaviour
     */
    function initFormLogic() {
        // If you select email as your preferred contact method, then 
        // the email input should be a required field.
        $forms.on('change', '.toggleRequiredEmail', function(){
            var id = $(this).attr('data-emailID');
            var isRequired = $(this).is(':checked');
            $forms.find(id).prop('required', isRequired).trigger('change')
                .siblings('label').find('.optional').toggle(!isRequired);
        });

        // Update the hidden date-time input values when you submit the form,
        // to ensure that the correct values get sent to the API
        $forms.on('submit', 'form', function() {
            updateHiddenJSONTimes( $(this).find('.available-times') );
        });

        // Initialise behaviour on the Available Times form section
        $forms.find('.available-times').each(function() {
            // Create a new Available Times section object
            var availableTimes = AvailableTimes( $(this) );
            // Create the first row
            availableTimes.addRow();

            $(this).siblings('.add-time-btn').on('click', function(e) {
                availableTimes.addRow();
                e.preventDefault();
            });

            $(this).on('click', '.remove-time', function(e) {
                availableTimes.removeRow( $(this).parent() );
                e.preventDefault();
            });
        });
    }

    /**
     * Class constructor for the .available-times form sections
     * Allows users to create and delete rows
     * @param  {object} $container - Container element jQuery node
     * @return {object} A new AvailableTimes class instance
     */
    function AvailableTimes($container) {
        return {
            $container: $container,
            type: $container.attr('data-type'),
            rowID: 0,
            
            /**
             * Create a new available times row and append to the DOM
             */
            addRow: function() {
                var $row = this.getNewRowElement();

                if (this.rowID > 0 && Modernizr.inputtypes.date) {
                    this.setInitialRowValue($row);
                }

                // Append the new row to the DOM
                this.$container.append($row);

                // Trigger update of time polyfill
                // See https://github.com/jonstipe/time-polyfill
                if (!Modernizr.inputtypes.time) {
                    var $times = $row.find('input[type="time"]')
                        .attr('step', 3600);
                    if ($times.inputTime) {
                        $times.inputTime();
                    }
                }

                // Trigger update of form validator
                this.$container.parents('form').validator('update');

                // Increment the rowID counter
                this.rowID += 1;

                this.toggleRemoveTimeBtn();
            },

            /**
             * Create a new Available Times row jQuery node
             * from the HTML template at the bottom of index.html
             * @return {object} New jQuery element (unattached to the DOM)
             */
            getNewRowElement: function() {
                // Replace the mustache-style template tags in the template 
                // with variable values, and turn it into a jQuery node
                var $row = $(
                    availableTimesRowTemplate
                        .replace(/{{type}}/g, this.type)
                        .replace(/{{id}}/g, this.rowID)
                );

                if (Modernizr.inputtypes.date) {
                    // Remove no-date-input fallback
                    $row.find('.text-date-block').remove();
                    // Set a minimum value for the date input to today's date
                    $row.find('.input--date').attr('min', dateToYYYYMMDD( new Date() ));
                } else {
                    // Remove date-input and use the fallback
                    $row.find('.calendar-date-block').remove();
                }

                return $row;
            },

            /**
             * If this is not the first row created, then make the new row's
             * value equal to the previous row, to save users having to
             * duplicate values when filling out the form
             * @param {object} $row - The jQuery element for the new row
             */
            setInitialRowValue: function($row) {
                // Select the previous row
                var $prevRow = this.$container
                    .find('.available-times__row')
                    .last();

                $row.find('input').each(function(){
                    // Get the class selector for the current input
                    var inputClass = '.' + $(this).attr('class')
                        .split(' ')
                        .join('.');
                    // Find the equivalent input in the previous row and get its value
                    var prevVal = $prevRow.find(inputClass)
                        .val();
                    // Set the current input's value to that of the previous one 
                    // and trigger an update
                    $(this).val(prevVal)
                        .trigger('update');
                });
            },

            /**
             * Delete the row, update the validator and toggle ✖️ buttons
             * @param {object} $row - The row to be deleted
             */
            removeRow: function($row) {
                $row.remove();
                this.$container.parents('form').validator('update');
                this.toggleRemoveTimeBtn();
            },

            /**
             * If there is only one row then there's no need to show a delete
             * button, so it ought to be hidden. But if there are multiple rows
             * then show the buttons.
             */
            toggleRemoveTimeBtn: function() {
                var rowCount = this.$container
                    .find('.available-times__row')
                    .length;
                this.$container
                    .find('.remove-time')
                    .toggle(rowCount > 1);
            }
        };
    }

    /**
     * When the form is submitted, we need to send the date and time values
     * in a useful format for the API. This function gets this data and adds it
     * to a hidden input so that it can be sent with the rest of the form data.
     * @param  {object} $availableTimes - The jQuery container node
     */
    function updateHiddenJSONTimes($availableTimes) {
        var timeData = getDateTimeValues($availableTimes);
        $availableTimes
            .siblings('.hiddenJSONTimes')
            .val(timeData);
    }

    /**
     * When submitting a form, retrieve the date, start time and end time
     * of all the available-time rows in the form.
     * Note: Date-times are in ISO 8601 format, e.g. 2017-01-01T06:00.
     * Start times and end-times in a single availability slot are
     * separated with the '/' character, while each availability slot is
     * separated with the '|' character.
     * e.g: 2017-01-01T06:00/2017-01-01T22:00|2017-01-01T06:00/2017-01-01T22:00
     * @param  {object} $availableTimes - The jQuery container node
     * @return {string} A formatted, stringified list of date-time values
     */
    function getDateTimeValues($availableTimes) {
        var datetimeClasses = [
            '.input--date',
            '.input--time-start',
            '.input--time-end'
        ];

        return $availableTimes.find('.available-times__row')
            .get()
            .map(function(row) {
                var $row = $(row);

                if (!Modernizr.inputtypes.date) {
                    $row.find('.input--date')
                        .val( getDateFallbackValues($row) );
                }

                var inputValues = datetimeClasses.map(function(c) {
                    return $row.find(c).val();
                });

                return formatAvailabilityPeriod.apply(this, inputValues);
            }).join('|');
    }

    /**
     * If the date input is not supported, we're using text/number inputs instead,
     * so retrieve the values from the 3 fallback inputs, and format them
     * @param  {object} $row - The jQuery element for the row
     * @return {string} A formatted date string
     */
    function getDateFallbackValues($row) {
        var dateFallbackClasses = [
            '.input--year',
            '.input--month',
            '.input--day'
        ];
        var dateValues = dateFallbackClasses.map(function(dateClass) {
            return $row.find(dateClass).val();
        });
        return dateToYYYYMMDD( new Date(dateValues) );
    }

    /**
     * Convert a single Availability Time row into a joined datetime string.
     * @param  {string} date - A date in YYYY-MM-DD format
     * @param  {string} startTime - A time in either 12 or 24-hour format
     * @param  {string} endTime - A time in either 12 or 24-hour format
     * @return {string} The datetime for a single row
     */
    function formatAvailabilityPeriod(date, startTime, endTime) {
        return [startTime, endTime].map(function(time){
            return toISO8601((date || ''), time);
        }).join('/');
    }

    /**
     * Convert a date and time to ISO 8601 format
     * (See https://www.w3.org/TR/NOTE-datetime)
     * Uses complete date plus hours and minutes but no time-zone
     * @param  {string} date - In YYYY-MM-DD format
     * @param  {string} time - In either 12 or 24-hour format
     * @return {string} A date in YYYY-MM-DDThh-mm format
     */
    function toISO8601(date, time) {
        return [date, to24Hour(time)].join('T');
    }

    /**
     * Convert a 12-hour time to 24-hour time
     * @param  {string} time - A time in either 12 or 24-hour format
     * @return {string} A time in 24-hour format
     */
    function to24Hour(time) {
        if (!time) {
            return '';
        }
        var period = time.match(/[AP]M/);
        if (!period) {
            return time; // is 24 hour time already
        }
        var divisions = time.split(':'),
            hours = divisions[0],
            minutes = divisions[1];
        if (period.toString() === 'PM' && +hours !== 12) {
            hours = +hours + 12;
        }
        return [hours,minutes].join(':');
    }

    /**
     * Convert a date object to 'YYYY-MM-DD' format
     * @param  {object} date - A date object.
     * @return {string} An ISO-compliant YYYY-MM-DD date string
     */
    function dateToYYYYMMDD(date) {
        var mm = date.getMonth() + 1;
        var dd = date.getDate();

        return [
            date.getFullYear(),
            mm<10 ? '0'+mm : mm,
            dd<10 ? '0'+dd : dd
        ].join('-');
    }

    /**
     * Load JSON data asynchronously and populate state dropdowns
     */
    function loadStateData() {
        $.getJSON('scripts/voting-details.json', function(data) {
            function getListItems(type) {
                return $.map(data, function (val, key) {
                    return '<li class="state-dropdown__item">' + '<a href="' + val[type] + '" target="_blank"  id="' + key + '" >' + val['State'] + '</a>' + '</li>';
                }).join('');
            }
            $("#state-select").html( getListItems('RegCheck') );
            $("#location-details").html( getListItems('LocationFinder') );
        });
    }


    // Start it up!
    initialise();
});

/**
 * This displays an address form, using the autocomplete feature
 * of the Google Places API to help users fill in the information.
 * Because `initAutocomplete()` is called after the autocomplete script
 * is downloaded (as part of the script parameters, see `_includes/footer.html`)
 * as a dynamic callback, it needs to be available globally
 * See https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
 * for more information
 */

(function(w) {
  var autocomplete = {
    riderCollectionAddress: null,
    riderDestinationAddress: null
  };

  w.initAutocomplete = function() {
    // Create the autocomplete object for each autocomplete input,
    // restricting the search to geographical location types.
    for (var key in autocomplete) {
      if (autocomplete.hasOwnProperty(key)) {
	autocomplete[key] = new google.maps.places.Autocomplete(
	  /** @type {!HTMLInputElement} */(document.getElementById(key)),
	  {types: ['geocode']});
      }
    }
  }

  /**
   * Bias the autocomplete object to the user's geographical location,
   * as supplied by the browser's 'navigator.geolocation' object.
   */

  w.autocompleteGeolocate = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
	  lat: position.coords.latitude,
	  lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
	  center: geolocation,
	  radius: position.coords.accuracy
        });

	for (var key in autocomplete) {
	  if (autocomplete.hasOwnProperty(key)) {
	    autocomplete[key].setBounds(circle.getBounds());
	  }
	}
      });
    }
  }
})(window);

$(function(){

    // Declare script-wide variables and constants

    var datetimeClasses = [
        '.input--date',
        '.input--time-start',
        '.input--time-end'
    ];
    
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
     * @retuen {object} A new AvailableTimes class instance
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

                if (!Modernizr.inputtypes.date) {
                    this.updateDateFallback($row);
                }

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
                    $row.find('.input--date').attr('min', yyyymmdd());
                } else {
                    // Remove date-input and use the fallback
                    $row.find('.calendar-date-block').remove();
                }

                return $row;
            },

            /**
             * If the date input is not supported then we use 3 text inputs instead,
             * with a hidden field to store their combined values.
             * @param {object} $row The jQuery element for the new row
             */
            updateDateFallback: function($row) {
                /**
                 * [updateDate description]
                 * @param  {string} field - key e.g. day, month, year
                 * @param  {number} value - The numberic value
                 * @return {string} A date in yyyy-mm-dd format
                 */
                function updateDate(field, value) {
                    var today = new Date();
                    var date = {
                        day: to2digits(today.getDate()),
                        month: to2digits(today.getMonth() + 1),
                        year: today.getFullYear()
                    };

                    if (field !== 'year') {
                        value = to2digits(value);
                    }
                    date[field] = value;

                    return [
                        date.year,
                        date.month,
                        date.day
                    ].join('-');
                }

                $row.on('change', '.input--date', function() {
                    var newDate = updateDate(
                        $(this).data('field'),
                        $(this).val()
                    );
                    $row.find('.input-formatted--date').val(newDate);
                });
            },

            /**
             * If this is not the first row created, then make the new row's
             * value equal to the previous row, to save users having to
             * duplicate values when filling out the form
             * @param {object} $row The jQuery element for the new row
             */
            setInitialRowValue: function($row) {
                var $prevRow = this.$container
                    .find('.available-times__row')
                    .last();
                datetimeClasses.forEach(function(c){
                    var prevVal = $prevRow.find(c).val();
                    $row.find(c).val(prevVal).trigger('update');
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

    function getDateTimeValues($availableTimes) {
        if (!Modernizr.inputtypes.date) {
            datetimeClasses[0] = '.input-formatted--date';
        }

        return $availableTimes.find('.available-times__row')
            .get()
            .map(function(li) {
                var inputValues = datetimeClasses.map(function(c) {
                    return $(li).find(c).val();
                });

                return formatTime.apply(this, inputValues);
            });
    }

    function updateHiddenJSONTimes($availableTimes) {
        var timeData = getDateTimeValues($availableTimes);
        $availableTimes.siblings('.hiddenJSONTimes').val(timeData.join('|'));
    }

    function formatTime(date, startTime, endTime) {
        return [startTime, endTime].map(function(time){
            return [(date || ''), to24Hour(time)].join('T');
        }).join('/');
    }

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

    function to2digits(n) {
        return ('0' + n).slice(-2);
    }

    function yyyymmdd(date) {
        date = date || new Date();
        var mm = date.getMonth() + 1;
        var dd = date.getDate();

        return [
            date.getFullYear(),
            mm<10 ? '0'+mm : mm,
            dd<10 ? '0'+dd : dd
        ].join('-');
    }

    // Load JSON data to dropdown template 
    $.getJSON('scripts/voting-details.json', function(data) {
        function getListItems(type) {
            return $.map(data, function (val, key) {
                return '<li class="state-dropdown__item">' + '<a href="' + val[type] + '" target="_blank"  id="' + key + '" >' + val['State'] + '</a>' + '</li>';
            }).join('');
        }
        $("#state-select").html( getListItems('RegCheck') );
        $("#location-details").html( getListItems('LocationFinder') );
    });


    // Start it up!

    initialise();
});
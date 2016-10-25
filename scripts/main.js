$(function(){
    var $forms = $('#forms'),
        $intro = $('#intro'),
        rowTemplate = $('#available-time-row').html(),
        supportsHistoryApi =  !!(window.history && history.pushState);

    var datetimeClasses = [
        '.input--date',
        '.input--time-start',
        '.input--time-end'
    ];

    toggleFormsOnHashChange();

    window.onpopstate = toggleFormsOnHashChange;


    // Rather than download all of Modernizr, just fake the bits we need:
    function checkInputSupport(type) {
        var input = document.createElement('input');
        input.setAttribute('type',type);
        var invalidValue = 'invalid-value';
        input.setAttribute('value', invalidValue); 
        return (input.type === type) && (input.value !== invalidValue);
    }

    window.Modernizr = {
        inputtypes: {
            date: checkInputSupport('date'),
            time: checkInputSupport('time')
        }
    };

    if (!Modernizr.inputtypes.time) {
        $('<link>').appendTo('head').attr({
            type: 'text/css', 
            rel: 'stylesheet',
            href: 'styles/time-polyfill.css'
        });
        $.getScript('scripts/time-polyfill.min.js');
    }

    if (!Modernizr.inputtypes.date) {
        $.getScript('scripts/nodep-date-input-polyfill.dist.js', function(){
            $('body').on('click', 'date-input-polyfill', function(){
                $('input[type="date"]').trigger('change');
            });
        });
    }

    // Initialise form validator
    $forms.find('form').validator({
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

    // Update sibling start/end time validation on change
    $forms.on('change', 'input[type="time"]', function(){
        var sibling = $(this).data('start') || $(this).data('end');
        $(sibling).trigger('input'); // Use a different event to prevent recursive trigger
    });


    function scrollTo(offset, speed) {
        $('html, body').animate({
            scrollTop: offset
        }, speed || 500);
    }

    function showForm(target){
        $(target).slideDown(200).attr('aria-hidden','false')
            .siblings().slideUp(200).attr('aria-hidden','true');
        $intro.slideUp(200).attr('aria-hidden','true');
        scrollTo(0);
    }

    function hideForms(){
        $forms.children().slideUp(200).attr('aria-hidden','true');
        $intro.slideDown(200).attr('aria-hidden','false');
        scrollTo(0);
    }

    function toggleFormsOnHashChange() {
        if (document.location.hash.length) {
            showForm(document.location.hash);
        } else {
            hideForms();
        }
    }

    $('#nav-links').on('click', '.scroll', function(e) {
        var anchor = $(this).attr('href');
        scrollTo($(anchor).offset().top, 999);
        e.preventDefault();
    });

    $intro.on('click', '.show-form', function(e) {
        var href = $(this).attr('href');
        showForm(href);
        if (supportsHistoryApi) {
            history.pushState({page: href}, href, href);
        } else {
            window.location.hash = href;
        }
        e.preventDefault();
    });

    $forms.on('click', '.close-form', function(e) {
        hideForms();
        if (supportsHistoryApi) {
            history.pushState({page: 'home'}, 'Home', '/' + window.location.search);
        } else {
            window.location.hash = '';
        }
        e.preventDefault();
    });

    $forms.on('change', '.toggleRequiredEmail', function(){
        var id = $(this).attr('data-emailID'),
            isRequired = $(this).is(':checked');
        $forms.find(id).prop('required', isRequired).trigger('change')
            .siblings('label').find('.optional').toggle(!isRequired);
    });

    $forms.on('submit', 'form', function() {
        updateHiddenJSONTimes( $(this).find('.available-times') );
    });

    $forms.find('.available-times').each(function() {
        var $self = $(this),
            type = $self.attr('data-type'),
            rowID = 0;

        function addRow(hideDeleteButton) {
            var $row = $(rowTemplate.replace(/{{type}}/g, type).replace(/{{id}}/g, rowID++));

            $row.find('.input--date').attr('min', yyyymmdd());

            if (!hideDeleteButton && Modernizr.inputtypes.date) {
                var $prevRow = $self.find('.available-times__row').last();
                datetimeClasses.forEach(function(c){
                    var prevVal = $prevRow.find(c).val();
                    $row.find(c).val(prevVal).trigger('update');
                });
            }

            if (hideDeleteButton) {
                $row.find('.remove-time').hide();
            }

            $self.append($row);

            if (!Modernizr.inputtypes.time) {
                var $times = $row.find('input[type="time"]').attr('step', 3600);
                if ($times.inputTime) {
                    $times.inputTime();
                }
            }

            $self.parents('form').validator('update');
        }

        function removeRow($row){
            $row.remove();
            $self.parents('form').validator('update');
        }

        function toggleRemoveTimeBtn() {
            var rowCount = $self.find('.available-times__row').length;
            $self.find('.remove-time').toggle(rowCount > 1);
        }

        addRow(true);

        $self.siblings('.add-time-btn').on('click', function(e) {
            addRow();
            toggleRemoveTimeBtn();
            e.preventDefault();
        });

        $self.on('click', '.remove-time', function(e) {
            removeRow( $(this).parent() );
            toggleRemoveTimeBtn();
            e.preventDefault();
        });
    });

    function getDateTimeValues($timesList) {
        return $timesList.find('.available-times__row').get().map(function(li) {
            var inputValues = datetimeClasses.map(function(c) {
                return $(li).find(c).val();
            });

            return formatTime.apply(this, inputValues);
        });
    }

    function updateHiddenJSONTimes($timesList) {
        var timeData = getDateTimeValues($timesList);
        $timesList.siblings('.hiddenJSONTimes').val(timeData.join('|'));
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
});
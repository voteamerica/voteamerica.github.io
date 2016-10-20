$(function(){
    var $forms = $('#forms'),
        $intro = $('#intro'),
        supportsHistoryApi =  !!(window.history && history.pushState);

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

    $forms.find('.available-times-list')
        .on('click', '.remove-time', function() {
            var $timesList = $(this).parents('.available-times-list');
            $(this).parent().remove();
            updateHiddenJSONTimes($timesList);
        });

    $forms.on('change', '.toggleRequiredEmail', function(){
        var id = $(this).attr('data-emailID');
        $forms.find(id).prop('required', $(this).is(':checked')).trigger('change');
    });

    $forms.on('submit', 'form', function() {
        updateHiddenJSONTimes( $(this).find('.available-times-list') );
    });

    toggleFormsOnHashChange();
    window.onpopstate = toggleFormsOnHashChange;

    $('.redirect').val(window.location.origin + window.location.pathname + 'thanks.html');

    var currentDateString = $.format.date(new Date(), "ddd, MMM d");
    $('#driver-button-date, #rider-button-date').text(currentDateString);
    

    function initDatePicker($datetime, $datepicker) {
        // Initialize datepickers
        // Max Date = Voting Day 2016!'
        $datepicker.datetimepicker({
            timepicker: false,
            format: 'l, M j',
            startDate: '2016/10/05',
            minDate: '2016/10/05',
            maxDate: '2016/11/08',
            yearStart: 2016,
            yearEnd: 2016,
            inline: true
        });

        // Must manually set the initial value of the calendar input
        // Needs to be today's date.
        var currDate = new Date();
        $datepicker.attr('value', currDate);

        $datepicker.on('change', function() {
            $datetime.find('.button-date').text($(this).val());
        });
    }

    function initTimeSlider($datetime, slider) {
        noUiSlider.create(slider, {
            start: [360, 1440],
            connect: true,
            step: 10,
            range: {
                'min': [360],
                'max': [1320]
            },
            pips: {
                mode: 'values',
                density: 2,
                values: [480, 720, 960, 1200, ],
                format: {
                    to: formatTime
                }
            }
        });

        slider.noUiSlider.on('update', function() {
            var sliderData = slider.noUiSlider.get();
            var startTime = formatTime(sliderData[0]);
            var endTime = formatTime(sliderData[1]);
            $datetime.find('.add-time-btn')
                .children('.button-time')
                .text(startTime + '-' + endTime);
        });
    }

    function addTimeBtnListener($datetime, $slider, $timesList, $datepicker) {
        $datetime.on('click', '.add-time-btn', function(e) {
            var sliderData = $slider[0].noUiSlider.get();
            var startTime = formatTime(sliderData[0]);
            var endTime = formatTime(sliderData[1]);

            var date = $datepicker.val();
            var niceDate = $.format.date(date, "ddd D MMMM");

            // not comfortable with this, but can't see why don't get this from datepicker
            var datePlusYear = date + " 2016";

            var niceDateYear = $.format.date(datePlusYear, "ddd D MMMM yyyy");
            var startDateTime = niceDateYear + ' ' + startTime;
            var endDateTime = niceDateYear + ' ' + endTime;

            var ndt = $.format.date(datePlusYear, "dd MMMM yyyy");
            var sdt = moment(ndt);
            var edt = moment(ndt);

            var sliderStartTime = formatTime2(sliderData[0]);
            var sliderEndTime   = formatTime2(sliderData[1]);

            var isoStart        = getISOString(sdt, sliderStartTime);
            var isoEnd          = getISOString(edt, sliderEndTime);


            var cancelButton = ' <button class="remove-time button--cancel" aria-label="Delete time">&times;</button>';

            var $listItem = $('<li/>')
                .data('datetime', [isoStart, isoEnd].join('/'))
                .html(niceDate + ', ' + startTime + '—' + endTime + cancelButton);

            $timesList.append($listItem);

            updateHiddenJSONTimes($timesList);

            e.preventDefault();
        });
    }

    function updateHiddenJSONTimes($timesList) {
        var timeData = $timesList.find('li').get().map(function(li) {
            return $(li).data('datetime');
        }).join('|');

        $timesList.siblings('.hiddenJSONTimes')
            .val(timeData)
            .trigger('change');
    }

    $('.date-time-pickers').each(function() {
        // Add selected date and time to list of available times on button click
        var $slider = $(this).find('.time-range-slider'),
            $timesList = $(this).find('.available-times-list'),
            $datepicker = $(this).find('.datepicker');

        initDatePicker($(this), $datepicker);

        initTimeSlider($(this), $slider.get(0));

        addTimeBtnListener($(this), $slider, $timesList, $datepicker);
    });

    function getISOString(date, timeAdjustment) {
        var isoString = '';

        date = date.add(timeAdjustment.mins, 'm');
        date = date.add(timeAdjustment.hour, 'h');

        if (timeAdjustment.am === false && timeAdjustment.hour !== 12) {
            date = date.add(12, 'h');
        }

        isoString = date.toISOString();

        return isoString;
    }

    // The sliders work with the day in terms of minutes, this function translates the minutes
    // into readable format i.e. 4:34pm
    function formatTime(minutes) {
        var am = false;
        if (minutes < 720) {
            am = true;
        }
        var hour = Math.floor(minutes / 60);
        hour = minutes < 780 ? hour : hour - 12;
        var out_minutes = minutes % 60;
        out_minutes = out_minutes < 10 ? '0' + out_minutes : out_minutes.toString();
        var ampmString = am ? 'am' : 'pm';

        return hour + ':' + out_minutes + ampmString;
    }

    function formatTime2(minutes) {
        var am = false;
        if (minutes < 720) {
            am = true;
        }
        var hour = Math.floor(minutes / 60);
        hour = minutes < 780 ? hour : hour - 12;
        var out_minutes = minutes % 60;
        out_minutes = out_minutes < 10 ? '0' + out_minutes : out_minutes.toString();
        var ampmString = am ? 'am' : 'pm';

        return {
            hour: hour,
            mins: out_minutes,
            am: am
        };
    }

    // Load JSON data to dropdown template 
    function listItem(type) {
        return function (val, key) {
            return '<li class="state-dropdown__item">' + '<a href="' + val[type] + '" target="_blank"  id="' + key + '" >' + val['State'] + '</a>' + '</li>';
        };
    }

    $.getJSON('scripts/voting-details.json', function(data) {
        $("#state-select").html( $.map(data, listItem('RegCheck')).join('') );
        $("#location-details").html( $.map(data, listItem('LocationFinder')).join('') );
    });
});
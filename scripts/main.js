$(function(){
    var $forms = $('#forms'),
        $intro = $('#intro'),
        rowTemplate = $('#available-time-row').html(),
        supportsHistoryApi =  !!(window.history && history.pushState);

    toggleFormsOnHashChange();
    window.onpopstate = toggleFormsOnHashChange;

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
        var id = $(this).attr('data-emailID');
        $forms.find(id).prop('required', $(this).is(':checked')).trigger('change');
    });

    $forms.on('submit', 'form', function() {
        updateHiddenJSONTimes( $(this).find('.available-times') );
    });

    $forms.find('.available-times').each(function() {
        var $self = $(this),
            type = $self.attr('data-type');

        function addRow(i, hideDeleteButton) {
            var $row = $(rowTemplate.replace(/{{type}}/g, type).replace(/{{i}}/g, i));
            $row.find('.form-input--date').attr('min', yyyymmdd());
            if (hideDeleteButton) {
                $row.find('.remove-time').hide();
            }
            $self.append($row);
        }

        function toggleRemoveTimeBtn(rowCount) {
            $self.find('.remove-time').toggle(rowCount > 1);
        }

        addRow(0, true);

        $self.siblings('.add-time-btn').on('click', function(e) {
            var $rows = $self.find('li'),
                rowCount = $rows.length;
            addRow(rowCount);
            toggleRemoveTimeBtn(rowCount + 1);
            updateHiddenJSONTimes($self);
            $self.parents('form').validator('update');
            e.preventDefault();
        });

        $self.on('click', '.remove-time', function(e) {
            $(this).parent().remove();
            toggleRemoveTimeBtn($self.find('li').length);
            updateHiddenJSONTimes($self);
            $self.parents('form').validator('update');
            e.preventDefault();
        });
    });

    function getDateTimeValues($timesList) {
        return $timesList.find('li').get().map(function(li) {
            return formatTime(
                $(li).find('.form-input--date').val(),
                $(li).find('.form-input--time-start').val(),
                $(li).find('.form-input--time-end').val()
            );
        });
    }

    function updateHiddenJSONTimes($timesList) {
        var timeData = getDateTimeValues($timesList);
        $timesList.siblings('.hiddenJSONTimes').val(timeData.join('|'));
    }

    function formatTime(date, startTime, endTime) {
        var toIsoTime = function (date, time) {
            if (!date || !time) {
                console.error('Invalid datetime: ', date, time);
                return '';
            }
            return new Date(date + ' ' + time).toISOString();
        };

        return [
            toIsoTime(date, startTime),
            toIsoTime(date, endTime)
        ].join('/');
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
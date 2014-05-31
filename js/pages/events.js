define(['jquery'], function() {
    var init = function(data)
    {
        $(document).ready(function() {
            var now = new Date(),
                $eventsList = $('.js-events-table'),
                $events = $eventsList.find('.js-event'),
                events = {
                    upcoming: [],
                    past: []
                },
                $fragment;

            $events.each(function (i, elem) {
                var eventDateString = elem.getAttribute('data-date'),
                    isMultidate = eventDateString.indexOf(',') !== -1,
                    eventDate,
                    isEventInPast = false;

                if (!eventDateString) {
                    return;
                }

                if (isMultidate) {
                    eventDate = [
                        new Date(eventDateString.split(',')[0]),
                        new Date(eventDateString.split(',')[1])
                    ];
                    if (isNaN(eventDate[0].getDate()) || isNaN(eventDate[1].getDate())) {
                        return;
                    }
                } else {
                    eventDate = new Date(eventDateString);
                    if (isNaN(eventDate.getDate())) {
                        return;
                    }
                }

                elem._isMultidate = isMultidate;
                elem._date = eventDate;

                if ((!isMultidate && eventDate < now) || (isMultidate && eventDate[1] < now)) {
                    events.past.push(elem);
                } else {
                    events.upcoming.push(elem);
                }
            });

            if (events.upcoming.length > 0 || events.past.length > 0) {
                $fragment = $(document.createDocumentFragment());
                $eventsList.html('');

                for (var eventType in events) {
                    if (events[eventType].length == 0) {
                        continue;
                    }

                    events[eventType].sort(function(leftElem, rightElem) {
                        var isLeftDateMulti = leftElem._isMultidate,
                            leftDate = isLeftDateMulti ? leftElem._date[1] : leftElem._date,
                            isRightDateMulti = rightElem._isMultidate,
                            rightDate = isRightDateMulti ? rightElem._date[1] : rightElem._date;

                        return rightDate - leftDate;
                    });

                    switch (eventType) {
                        case 'upcoming':
                            $fragment.append('<tr class="events-table-header-row"><td colspan="3"><h2 class="events-list-title">Upcoming</h2></td></tr>');
                            break;

                        case 'past':
                            $fragment.append('<tr class="events-table-header-row"><td colspan="3"><h2 class="events-list-title">Past</h2></td></tr>');
                            break;
                    }

                    $(events[eventType]).each(function (i, elem) {
                        $fragment.append(elem);
                    });
                }

                $eventsList.append($fragment);
            }
        });
    };

    return init;
});
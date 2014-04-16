if (typeof ui === 'undefined') {
    var ui = {};
}

ui.events = {
    init: function() {
        var now = new Date(),
            $eventsList = $('.js-events-list'),
            $events = $eventsList.find('.js-event'),
            events = {
                upcoming: [],
                past: []
            },
            $fragment;

        $events.each(function (i, elem) {
            var $elem,
                eventDateString = elem.getAttribute('data-date'),
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
                isEventInPast = true;
                events.past.push(elem);
            } else {
                events.upcoming.push(elem);
            }
        });

        if (events.upcoming.length > 0 || events.past.length > 0) {
            $fragment = $(document.createDocumentFragment());
            $eventsList.html('');

            for (var eventType in events) {
                events[eventType].sort(function(leftElem, rightElem) {
                    var isLeftDateMulti = leftElem._isMultidate,
                        leftDate = isLeftDateMulti ? leftElem._date[1] : leftElem._date,
                        isRightDateMulti = rightElem._isMultidate,
                        rightDate = isRightDateMulti ? rightElem._date[1] : rightElem._date;

                    return rightDate - leftDate;
                });

                switch (eventType) {
                    case 'upcoming':
                        $fragment.append('<h2 class="events-list-title">Upcoming</h2>');
                        break;

                    case 'past':
                        $fragment.append('<h2 class="events-list-title">Past</h2>');
                        break;
                }

                $(events[eventType]).each(function (i, elem) {
                    $fragment.append(elem);
                });
            }

            $eventsList.append($fragment);
        }
    }
};
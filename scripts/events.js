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
            };

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
            } else {
                eventDate = new Date(eventDateString);
            }

            if ((!isMultidate && eventDate < now) || (isMultidate && eventDate[1] < now)) {
                isEventInPast = true;
                events.past.push(elem);
            } else {
                events.upcoming.push(elem);
            }
        });

        $eventsList.html('');

        if (events.upcoming.length > 0) {
            $eventsList.append('<h2 class="events-list-title">Upcoming</h2>');
            $(events.upcoming).each(function (i, elem) {
                $eventsList.append(elem);
            });
        }

        if (events.past.length > 0) {
            $eventsList.append('<h2 class="events-list-title">Past</h2>');
            $(events.past).each(function (i, elem) {
                $eventsList.append(elem);
            });
        }
    }
};
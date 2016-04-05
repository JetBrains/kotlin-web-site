define([
    'jquery',
    'util/render',
    'util/common'
], function ($, render, util) {

    var helpers = {},
        templates = {};

    helpers.formatDate = function (date) {
        var formatted = '',
            isRange = util.isArray(date),
            months = EventsTable.MONTHS,
            nowYear = EventsTable.NOW_DATE.getFullYear(),
            year, month, day;

        if (isRange) {
            month = [
                months[date[0].getMonth()],
                months[date[1].getMonth()]
            ];
            year = [date[0].getFullYear(), date[1].getFullYear()];
            day = [date[0].getDate(), date[1].getDate()];

            if (month[0] !== month[1]) {
                formatted = month[0] + ' ' + day[0] + '-' + month[1] + ' ' + day[1];
            } else {
                formatted = month[0] + ' ' + day[0] + '-' + day[1];
            }

            if (year[0] !== nowYear || year[1] !== nowYear) {
                formatted += ', ' + year[1];
            }
        }
        else {
            year = date.getFullYear();
            month = months[date.getMonth()];
            day = date.getDate();

            formatted = month + ' ' + day;
            if (year !== nowYear) {
                formatted += ', ' + year;
            }
        }

        return formatted;
    };

    templates.main = function (events) {
        var now = EventsTable.NOW_DATE,
            pastEvents = [],
            futureEvents = [],
            hasPastEvents, hasFutureEvents;

        // Split events list to past and future events
        for (var i = 0, len = events.length; i < len; i++) {
            var event = events[i];
            var isRangeOfDates = util.isArray(event.date);

            if (isRangeOfDates)
                ((event.date[0] < now || event.date[1] < now)
                    ? pastEvents
                    : futureEvents
                    ).push(event);
            else
                (event.date < now ? pastEvents : futureEvents).push(event);
        }

        hasPastEvents = pastEvents.length > 0;
        hasFutureEvents = futureEvents.length > 0;

        return [
            ['.events-table',
                hasFutureEvents
                    ? ['.events-table-row',
                    ['.events-table-row-title', 'Upcoming Events'],
                    templates.eventsList(futureEvents)
                ]
                    : null,
                hasPastEvents
                    ? ['.events-table-row',
                    ['.events-table-row-title', 'Past Events'],
                    templates.eventsList(pastEvents)
                ]
                    : null
            ]
        ];
    };

    templates.eventsList = function (events) {
        var template = ['.events-list'];

        for (var i = 0, len = events.length; i < len; i++) {
            template.push(this.event(events[i]));
        }

        return [template];
    };

    templates.event = function (event) {
        var hasUrl = 'url' in event,
            hasSubject = 'subject' in event,
            hasContent = 'content' in event,
            hasSpeaker = 'speaker' in event,
            isMultipleSpeakers = hasSpeaker && util.isArray(event.speaker),
            hasLocation = 'location' in event;

        var t =
            ['.event',
                ['.event-date-col',
                    ['.event-date', helpers.formatDate(event.date)]
                ],
                ['.event-title-col',
                    ['.event-title',
                        hasUrl
                            ? ['a.event-url', {href: event.url, target: '_blank'}, event.title]
                            : event.title
                    ],
                    hasLocation
                        ? ['.event-location', event.location]
                        : null
                ],
                ['.event-info-col',
                    ['.event-subject',
                        hasSubject ? ['span.text', event.subject] : null,
                        templates.eventContent(event)
                    ],
                    hasSpeaker
                        ? ['.event-speaker',
                        isMultipleSpeakers
                            ? event.speaker.join(', ')
                            : event.speaker
                    ]
                        : null
                ]
            ];

        return t;
    };

    templates.eventContent = function (event) {
        var hasContent = 'content' in event,
            template = [
                '.event-info-indicators'
            ];

        if ('lang' in event) {
            template.push(['.event-lang', event.lang]);
        }

        if (hasContent) {
            for (var itemType in event.content) {
                var itemUrl = event.content[itemType];
                var itemTitle = itemType.charAt(0).toUpperCase() + itemType.slice(1);

                template.push(['a.event-content-item._' + itemType, {
                    href: itemUrl,
                    target: '_blank',
                    title: itemTitle
                }]);
            }
        }

        return template;
    };


    function EventsTable(elem, events) {
        var that = this;

        that.elem = elem;

        // Convert event date from string to Date object
        for (var i = 0, len = events.length; i < len; i++) {
            var event = events[i];
            var isDateRange = util.isArray(event.date);

            if (isDateRange && (typeof event.date[0] === 'string')) {
                event.date = [
                    new Date(event.date[0]),
                    new Date(event.date[1])
                ];
            }
            else if (!isDateRange && typeof event.date === 'string') {
                event.date = new Date(event.date);
            }
        }

        // Sorting
        events.sort(function(a, b) {
            var dateA = a.date,
                dateB = b.date,
                isADateIsRange = util.isArray(dateA),
                isBDateIsRange = util.isArray(dateB),
                compareA = isADateIsRange ? dateA[1] : dateA,
                compareB = isBDateIsRange ? dateB[1] : dateB;

            if (compareA === compareB) {
                return 0;
            }

            return (compareA < compareB) ? 1 : -1;
        });

        this.events = events;

        elem.appendChild(that.render());
    }

    EventsTable.MONTHS = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    EventsTable.NOW_DATE = new Date();

    EventsTable.prototype.elem = null;

    EventsTable.prototype.events = null;

    EventsTable.prototype.render = function () {
        return render(templates.main(this.events));
    };

    return EventsTable;
});
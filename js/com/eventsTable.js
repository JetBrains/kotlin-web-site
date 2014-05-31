define([
    'jquery',
    'util/render',
    'util/common'
], function($, render, util) {

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

        document.body.appendChild(this.render(events));
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

    EventsTable.helpers = {};

    EventsTable.helpers.formatDate = function(date) {
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
                formatted = month[0] + ' ' + day[0] + ' - ' + month[1] + ' ' + day[1];
            } else {
                formatted = month[0] + ' ' + day[0] + ' - ' + day[1];
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

    EventsTable.templates = {};

    EventsTable.templates.main = function(events) {
        return this.eventsList(events);
    };

    EventsTable.templates.eventsList = function(events) {
        var template = [];

        for (var i = 0, len = events.length; i < len; i++) {
            template.push(this.event(events[i]));
        }

        return template;
    };

    EventsTable.templates.event = function(event) {
        var helpers = EventsTable.helpers,
            templates = EventsTable.templates,
            hasUrl = 'url' in event,
            hasSubject = 'subject' in event,
            hasContent = 'content' in event,
            hasSpeaker = 'speaker' in event,
            isMultipleSpeakers = hasSpeaker && util.isArray(event.speaker),
            isDateRange = util.isArray(event.date),
            hasLocation = 'location' in event;

        var t =
            ['.event',
                ['.event-date-block',
                    ['.event-date', helpers.formatDate(event.date)]
                ],
                ['.event-title-block',
                    ['.event-title',
                        hasUrl
                            ? ['a.event-url', {href: event.url, target: '_blank'}, event.title]
                            : event.title
                    ]
                ],
                ['.event-info-block',
                    ['.event-subject', event.subject],
                    hasContent
                        ? templates.eventContent(event)
                        : null,
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

    EventsTable.templates.eventContent = function(event) {
        var template = [
            '.event-info-indicators'
        ];

        if ('lang' in event) {
            template.push(['.event-lang', event.lang]);
        }

        for (var itemType in event.content) {
            var itemUrl = event.content[itemType];
            template.push(['a.event-content-item._' + itemType, {
                href: itemUrl,
                target: '_blank'
            }]);
        }

        return template;
    };

    EventsTable.prototype.elem = null;

    EventsTable.prototype.render = function(events) {
        return render(EventsTable.templates.main(events));
    };

    return EventsTable;
});
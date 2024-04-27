import { render } from '../util/render';
import { isArray } from '../util/common';

const helpers = {
  formatDate(date) {
    const months = EventsTable.MONTHS;
    const nowYear = EventsTable.NOW_DATE.getFullYear();

    if (isArray(date)) {
      const [start, end] = date;
      const [startMonth, endMonth] = [months[start.getMonth()], months[end.getMonth()]];
      const [startYear, endYear] = [start.getFullYear(), end.getFullYear()];
      const [startDay, endDay] = [start.getDate(), end.getDate()];

      let formatted = (startMonth !== endMonth) ?
        `${startMonth} ${startDay}-${endMonth} ${endDay}` :
        `${startMonth} ${startDay}-${endDay}`;

      if (startYear !== nowYear || endYear !== nowYear) {
        formatted += `, ${endYear}`;
      }
      return formatted;
    } else {
      const year = date.getFullYear();
      const month = months[date.getMonth()];
      const day = date.getDate();
      let formatted = `${month} ${day}`;
      if (year !== nowYear) {
        formatted += `, ${year}`;
      }
      return formatted;
    }
  }
};

const templates = {
  main(events) {
    const now = EventsTable.NOW_DATE;
    const pastEvents = events.filter(event => event.date < now);
    const futureEvents = events.filter(event => event.date >= now);

    return [
      ['.events-table',
        futureEvents.length ? ['.events-table-row',
          ['.events-table-row-title', 'Upcoming Events'],
          ...templates.eventsList(futureEvents)
        ] : null,
        pastEvents.length ? ['.events-table-row',
          ['.events-table-row-title', 'Past Events'],
          ...templates.eventsList(pastEvents)
        ] : null
      ]
    ];
  },

  eventsList(events) {
    return ['.events-list', ...events.map(event => templates.event(event))];
  },

  event(event) {
    const { date, url, title, location, subject, speaker, content } = event;
    const formattedDate = helpers.formatDate(date);

    return ['.event',
      ['.event-date-col',
        ['.event-date', formattedDate]
      ],
      ['.event-title-col',
        ['.event-title',
          url ? ['a.event-url', { href: url, target: '_blank' }, title] : title,
          location ? ['.event-location', location] : null
        ]
      ],
      ['.event-info-col',
        ['.event-subject',
          subject ? ['span.text', subject] : null,
          ...templates.eventContent(content)
        ],
        speaker ? ['.event-speaker', speaker.join(', ')] : null
      ]
    ];
  },

  eventContent(content) {
    const template = ['.event-info-indicators'];
    if (content) {
      for (const [itemType, itemUrl] of Object.entries(content)) {
        const itemTitle = itemType.charAt(0).toUpperCase() + itemType.slice(1);
        template.push(['a.event-content-item._' + itemType, {
          href: itemUrl,
          target: '_blank',
          title: itemTitle
        }]);
      }
    }
    return template;
  }
};

class EventsTable {
  static MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  static NOW_DATE = new Date();

  constructor(elem, events) {
    this.elem = elem;
    this.events = events.map(event => ({
      ...event,
      date: isArray(event.date) ? event.date.map(date => new Date(date)) : new Date(event.date)
    })).sort((a, b) => b.date - a.date);
    this.render();
  }

  render() {
    this.elem.appendChild(render(templates.main(this.events)));
  }
}

export default EventsTable;

import $ from "jquery";
import Event from "./Event";
import City from "./City";
import languages from "./lang";

export default class EventsStore {
  static FILTERS = {
    time: (time, event) => {
      let matched = false;
      const hasTag = event.hasTag('kotlin1.1');

      switch (time) {
        case 'upcoming':
          matched = (!hasTag || event.pinned) && event.isUpcoming();
          break;

        case 'past':
          matched = (!hasTag || event.pinned) && !event.isUpcoming();
          break;

        case 'all':
          matched = (!hasTag || event.pinned);
          break;
        case null:
        default:
          matched = false;
          break;
      }

      return matched;
    },

    lang: (lang, event) => {
      return lang === 'all' || event.lang === lang;
    },

    materials: (materialType, event) => {
      return materialType === 'all' || event.content && event.content.hasOwnProperty(materialType);
    },

    bounds: (bounds, event) => {
      return bounds.contains(event.getBounds());
    }
  };

  static MATERIAL_TYPE = {
    examples: 'Examples',
    slides: 'Slides',
    video: 'Video',
    pdf: 'PDF',
    article: 'Article'
  };

  /**
   * @param {Object} eventsData Raw events data
   * @param {Object} citiesData Raw cities data
   */
  constructor(eventsData, citiesData) {
    const store = this;
    this.events = [];
    this.cities = [];

    const citiesNames = citiesData.map(data => data.name);
    const citiesMissedInDict = [];

    eventsData
      .filter(data => typeof data.location !== 'undefined')
      .map(data => data.location)
      .filter((value, index, self) => self.indexOf(value) === index)
      .forEach(eventCity => {
        if (citiesNames.indexOf(eventCity) === -1) {
          citiesMissedInDict.push(eventCity);
        }
      });

    if (citiesMissedInDict.length > 0) {
      console.warn('Cities missed in cities.yml:\n' + citiesMissedInDict.join('\n'));
    }

    citiesData.forEach(data => store.cities.push(new City(data)));

    eventsData.forEach((data, i) => {
      const eventCityExistInDict = data.location && citiesNames.indexOf(data.location) !== -1;

      if (!eventCityExistInDict) {
        return;
      }

      data.id = i.toString();
      store.events.push(new Event(data));
    });

    store.events.forEach((event) => {
      event.city = store.cities.filter(city => city.name === event.city)[0];
    });

    this.sort();
  }

  /**
   * @param {string} eventsUrl
   * @param {string} citiesUrl
   * @returns {Deferred}
   */
  static create(eventsUrl, citiesUrl) {
    let events;
    let cities;

    return $.getJSON(eventsUrl)
      .then(result => events = result)
      .then(() => $.getJSON(citiesUrl))
      .then((result) => cities = result)
      .then(() => new EventsStore(events, cities));
  }

  sort() {
    this.events.sort((a, b) => {
      const compareA = a.endDate;
      const compareB = b.endDate;

      if (b.pinned) {
        return -1;
      }

      if (compareA === compareB) {
        return 0;
      }

      return (compareA < compareB) ? 1 : -1;
    });
  }

  /**
   * @param {Array<Event>} [events]
   * @returns {Array<Event>}
   */
  getUpcomingEvents(events) {
    const filtered = (events || this.events)
      .filter(event => event.isUpcoming())
      .sort((eventA, eventB) => {
        const startA = eventA.startDate;
        const startB = eventB.startDate;

        if (eventA.pinned) {
          return -1;
        }

        if (startA === startB) {
          return 0;
        }

        return startA < startB ? -1 : 1;
      });

    return filtered;
  }

  /**
   * @param {Array<Event>} [events]
   * @returns {Array<Event>}
   */
  getPastEvents(events) {
    return (events || this.events).filter((event) => !event.isUpcoming());
  }

  /**
   * @param {Object} constraints
   * @param {string} constraints.time
   * @param {string} constraints.lang
   * @param {string} constraints.materials
   * @param {google.maps.LatLng} constraints.bounds
   * @param {Array<Event>} [evts]
   * @returns {Array<Event>}
   */
  filter(constraints, evts) {
    const events = evts || this.events;
    const filtered = [];
    const constraintNames = Object.keys(constraints);

    events.forEach((event) => {
      let performedConstraintsCount = 0;

      constraintNames.forEach((name) => {
        const constraint = constraints[name];
        const filter = EventsStore.FILTERS[name];
        if (filter(constraint, event)) {
          performedConstraintsCount++;
        }
      });

      if (performedConstraintsCount === constraintNames.length) {
        filtered.push(event);
      }
    });

    return filtered;
  }

  /**
   * @returns {Object<string, string>}
   */
  getLanguages() {
    const idsList = $.unique( this.events.map(event => event.lang) );
    const map = {};

    idsList.forEach((langId) => {
      if (langId in languages) {
        map[langId] = languages[langId].name;
      }
    });

    return map;
  }

  /**
   * @see EventsStore.materialsDict
   * @returns {Object<string, string>}
   */
  getMaterials() {
    let list = [];

    this.events.forEach((event) => {
      if (event.content) {
        list = list.concat(Object.keys(event.content));
      }
    });

    const listMap = {};
    list = $.unique(list);
    list.forEach((materialId) => listMap[materialId] = EventsStore.MATERIAL_TYPE[materialId]);

    return listMap;
  }
}
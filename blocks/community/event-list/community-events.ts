import communityEventsRaw from './../../../data/events.yml';
import {CommunityEvent} from "./community-event";

export let communityEvents: CommunityEvent[] = getEvents(communityEventsRaw as CommunityEventData[]);

function getEvents(data: CommunityEventData[]): CommunityEvent[] {
    const events = data.map(communityEvent => new CommunityEvent(communityEvent));
    sortEvents(events);
    return events;
}

function sortEvents(events) {
    events.sort((a, b) => {
        const compareA = a.endDate;
        const compareB = b.endDate;

        if (compareA === compareB) {
            return 0;
        }

        return (compareA < compareB) ? 1 : -1;
    });
}
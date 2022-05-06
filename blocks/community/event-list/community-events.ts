import communityEventsRaw from './../../../data/events.yml';
import { CommunityEvent } from './community-event';

export let communityEvents: CommunityEvent[] = getEvents(communityEventsRaw as CommunityEventData[]);

function getEvents(data: CommunityEventData[]): CommunityEvent[] {
    return data.map((communityEvent) => new CommunityEvent(communityEvent));
}

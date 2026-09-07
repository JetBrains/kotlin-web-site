type AnniversaryMeetupsData = AnniversaryMeetup[];

interface AnniversaryMeetup {
    name: string;
    city: string;
    country: string;
    /** ISO date, YYYY-MM-DD */
    date: string;
    /** Omitted, empty or null until the organizer's event page is public. */
    url?: string | null;
    position: UserGroupPosition;
}

type AnniversaryMeetupsData = AnniversaryMeetup[];

interface AnniversaryMeetup {
    name: string;
    city: string;
    country: string;
    /** ISO date, YYYY-MM-DD */
    date: string;
    /** Empty until the organizer's event page is public. */
    url: string;
    position: UserGroupPosition;
}

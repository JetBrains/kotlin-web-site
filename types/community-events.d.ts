interface CommunityEventData {
    lang: string;
    startDate: string;
    endDate: string;
    location?: string;
    speaker: string;
    title: string;
    subject: string;
    url: string;
    online?: boolean;
    content?: {
        slides?: string;
        video?: string;
    }
}
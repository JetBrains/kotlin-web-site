import { formatDate } from '../../../static/js/util/date';
import { nanoid } from 'nanoid';

const DEFAULT_LANG = 'en';

export class CommunityEvent {
    id: string;
    title: string;
    url: string;
    subject: string;
    speaker: string;
    location: string;
    online: boolean;
    lang: string;
    content?: {
        video?: string;
        slides?: string;
    };
    startDate: Date;
    endDate: Date;
    formattedDate: string;

    constructor(data: CommunityEventData) {
        this.id = nanoid();
        this.title = data.title;
        this.url = data.url;
        this.subject = data.subject;
        this.speaker = data.speaker;
        this.location = data.location;
        this.online = !!data.online;
        this.lang = data.lang || DEFAULT_LANG;
        this.content = data.content;
        this.startDate = new Date(data.startDate + 'T00:00:00');
        this.endDate = new Date(data.endDate + 'T23:59:59');
        this.formattedDate = formatDate(this.startDate, this.endDate);
    }

    isUpcoming() {
        return this.endDate >= new Date();
    }
}

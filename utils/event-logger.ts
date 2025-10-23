interface GoogleAnalyticsEvent {
    eventCategory?: string;
    eventAction?: string;
    eventLabel?: string;
    value?: number;
    customParameters?: Record<string, string | number | boolean>;
}

export function trackEvent(event: GoogleAnalyticsEvent) {
    if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'GAEvent',
            ...event,
        });
    }
}
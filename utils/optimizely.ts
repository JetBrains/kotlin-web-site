export function trackOptimizelyEvent(eventName: string, properties?: Record<string, string>) {
    if (typeof window !== 'undefined') {
        (window as any).optimizely = (window as any).optimizely || [];
        (window as any).optimizely.push({ type: 'event', eventName, ...(properties && { properties }) });
    }
}

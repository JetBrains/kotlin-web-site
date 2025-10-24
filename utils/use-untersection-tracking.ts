import { useEffect, useRef, useState } from 'react';

/**
 * Tracks the intersection of a target DOM element
 * with the viewport and triggers a callback
 * when the element becomes visible.
 */
export const useIntersectionTracking = (
    callback: () => void,
    visibilityDelay: number = 5000
) => {
    const threshold = 0.3;
    const triggerOnce = true;

    const elementRef = useRef<HTMLElement>(null);
    const [hasTriggered, setHasTriggered] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }

                    timeoutRef.current = setTimeout(() => {
                        callback();
                        if (triggerOnce) {
                            setHasTriggered(true);
                        }
                        timeoutRef.current = null;
                    }, visibilityDelay);
                } else {
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                    }
                }
            },
            {
                threshold
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [callback, threshold, triggerOnce, hasTriggered, visibilityDelay]);

    return elementRef;
};
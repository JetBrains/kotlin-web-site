import { useEffect, useRef } from 'react';

// Strip the hash early (module-level, runs before any render/scroll)
// so the browser doesn't attempt its native scroll-to-anchor.
const savedHash =
    typeof window !== 'undefined' && window.location.hash ? window.location.hash : '';
if (savedHash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
}

/**
 * Defers anchor scrolling until layout is ready.
 *
 * IMPORTANT: Importing this module strips the URL hash immediately
 * to prevent the browser's native scroll-to-anchor behavior.
 */
export function useDeferredAnchorScroll(isLayoutReady: boolean) {
    const hasScrolledToAnchor = useRef(false);

    useEffect(() => {
        if (!isLayoutReady) return;
        if (hasScrolledToAnchor.current) return;
        if (!savedHash) return;

        // Restore the hash silently (without triggering the browser scroll)
        history.replaceState(null, '', savedHash);
        markTargetElement();
        scrollToTargetElement();
        hasScrolledToAnchor.current = true;
    }, [isLayoutReady]);
}

function markTargetElement() {
    const hash = window.location.hash;
    if (!hash) return;

    const elementId = hash.substring(1);
    const targetElement = document.getElementById(elementId);
    if (targetElement) {
        targetElement.setAttribute('data-target', 'true');
    }
}

function scrollToTargetElement() {
    const hash = window.location.hash;
    if (!hash) return;

    const elementId = hash.substring(1);
    const targetElement = document.getElementById(elementId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

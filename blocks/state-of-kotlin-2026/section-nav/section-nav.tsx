import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Switcher } from '@rescui/switcher';
import { StickyHeader } from '@/components/sticky-header/sticky-header';
import { trackEvent } from '@/utils/event-logger';

import styles from './section-nav.module.css';

const SWITCHER_ITEMS = [
    { label: '15 years of growth', anchor: 'growth' },
    { label: 'Organizations', anchor: 'organizations' },
    { label: 'Backend', anchor: 'backend' },
    { label: 'Multiplatform', anchor: 'multiplatform' },
    { label: 'Kotlin and AI', anchor: 'ai' }
];

const SWITCHER_OPTIONS = SWITCHER_ITEMS.map((item) => ({ label: item.label, value: item.anchor }));

const SWITCHER_ANCHORS = SWITCHER_ITEMS.map((item) => item.anchor);

const STUCK_SCROLL_OFFSET = 40;

// A section takes over once it crosses this share of the viewport, well below the sticky bar.
const ACTIVATION_LINE_RATIO = 0.35;

// Smooth scrolling flies over the sections in between, so tracking waits for it to arrive.
const SMOOTH_SCROLL_TIMEOUT = 1200;

const scrollToAnchor = (anchor: string) => {
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
};

const readAnchorFromScroll = (): string => {
    const activationLine = window.innerHeight * ACTIVATION_LINE_RATIO;

    return SWITCHER_ANCHORS.reduce((active, anchor) => {
        const section = document.getElementById(anchor);
        return section && section.getBoundingClientRect().top <= activationLine ? anchor : active;
    }, SWITCHER_ANCHORS[0]);
};

const readAnchorFromUrl = (): string | null => {
    const anchor = window.location.hash.slice(1);
    return SWITCHER_ANCHORS.includes(anchor) ? anchor : null;
};

// The history API keeps the anchor shareable without the native jump that would break the smooth scroll.
const writeAnchorToUrl = (anchor: string) => {
    const { pathname, search } = window.location;
    window.history.replaceState(null, '', `${pathname}${search}#${anchor}`);
};

export const SectionNav: FC = () => {
    const [activeAnchor, setActiveAnchor] = useState(SWITCHER_ITEMS[0]?.anchor);
    const [isStuck, setIsStuck] = useState(false);
    const pendingAnchor = useRef<{ anchor: string; deadline: number } | null>(null);

    useEffect(() => {
        let frame = 0;

        const sync = () => {
            frame = 0;
            setIsStuck(window.scrollY > STUCK_SCROLL_OFFSET);

            const anchor = readAnchorFromScroll();
            const pending = pendingAnchor.current;

            if (pending) {
                if (pending.anchor !== anchor && Date.now() < pending.deadline) return;
                pendingAnchor.current = null;
            }

            setActiveAnchor(anchor);
        };

        const handleScroll = () => {
            if (!frame) frame = requestAnimationFrame(sync);
        };

        sync();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    useEffect(() => {
        const syncWithUrl = () => {
            const anchor = readAnchorFromUrl();
            if (anchor) setActiveAnchor(anchor);
        };
        syncWithUrl();
        window.addEventListener('hashchange', syncWithUrl);
        return () => window.removeEventListener('hashchange', syncWithUrl);
    }, []);

    const handleSwitcherChange = useCallback((anchor: string) => {
        pendingAnchor.current = { anchor, deadline: Date.now() + SMOOTH_SCROLL_TIMEOUT };
        setActiveAnchor(anchor);
        writeAnchorToUrl(anchor);
        scrollToAnchor(anchor);
        trackEvent({ eventAction: 'kt_sok_hero_switcher', eventLabel: anchor });
    }, []);

    return (
        <StickyHeader>
            <div className={cn(styles.bar, { [styles.barStuck]: isStuck })} data-testid="sok-section-nav">
                <Switcher
                    mode="rock"
                    size="m"
                    value={activeAnchor}
                    onChange={handleSwitcherChange}
                    options={SWITCHER_OPTIONS}
                    className={styles.switcher}
                    data-e2e="sok-hero-switcher"
                />
            </div>
        </StickyHeader>
    );
};

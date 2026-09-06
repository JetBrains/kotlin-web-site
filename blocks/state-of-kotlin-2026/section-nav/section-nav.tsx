import React, { FC, useCallback, useEffect, useState } from 'react';
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

const scrollToAnchor = (anchor: string) => {
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
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

    useEffect(() => {
        const handleScroll = () => {
            setIsStuck(window.scrollY > 40);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
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

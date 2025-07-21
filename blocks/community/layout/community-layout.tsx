import React, { FC, useCallback } from 'react';
import { useRouter } from 'next/router';
import Button from '@rescui/button';
import { SectionLayout } from '../../../components/layout/section-layout';
import { NavigationItem } from '../../../components/layout/layout-types';
import { CommunityAddEvent } from '../event-list/event-list';
import { addTrailingSlash } from '../../../components/layout/url-utils';
import styles from './community-layout.module.css';

/**
 * Community section URL and title
 */
export const COMMUNITY_URL = '/community/';
export const COMMUNITY_TITLE = 'Community';

/**
 * Community section navigation items
 */
const COMMUNITY_NAV_ITEMS: NavigationItem[] = [
    {
        url: '/community/',
        title: 'Overview'
    },
    {
        url: '/community/user-groups/',
        title: 'Kotlin User Groups'
    }
];

/**
 * Community layout props interface
 * @deprecated Use SectionLayoutProps from '../../../components/layout/types/layout-types' instead
 */
interface CommunityLayoutProps {
    title: string;
    description?: string;
    ogImageName?: string;
    children: React.ReactNode;
}

/**
 * Community layout component
 * This is a wrapper around SectionLayout that maintains backward compatibility
 * while using the new layout architecture
 * 
 * @deprecated Use SectionLayout directly with section="community" instead
 */
export const CommunityLayout: FC<CommunityLayoutProps> = ({ 
    title, 
    ogImageName, 
    description, 
    children 
}) => {
    const router = useRouter();
    const pathname = addTrailingSlash(router.pathname);
    
    // Create a copy of the navigation items
    let items = [...COMMUNITY_NAV_ITEMS];
    
    // Handle active menu items that aren't in the predefined list
    const activeIndex = items.map((item) => item.url).indexOf(pathname);
    if (activeIndex === -1) {
        items = [...items, {
            url: pathname,
            title,
        }];
    }
    
    // Create the top menu extra content
    const topMenuExtra = pathname === '/community/events/' ? (
        <CommunityAddEvent
            className={styles.add}
            size="s"
            href="https://github.com/JetBrains/kotlin-web-site/blob/master/README.md#community-events"
        />
    ) : undefined;
    
    // Create the CTA block configuration
    const ctaBlock = {
        topTitle: 'Help us improve',
        mainTitle: (
            <>
                Give us your feedback or ask any questions
                <br />
                you have about the Kotlin community
            </>
        ),
        buttonText: 'Write to us',
        buttonLink: 'mailto:kug@jetbrains.com'
    };
    
    return (
        <SectionLayout
            title={title}
            description={description}
            ogImageName={ogImageName}
            section="community"
            theme="dark"
            showHeader={true}
            showFooter={true}
            stickyHeader={true}
            sectionTitle={COMMUNITY_TITLE}
            sectionUrl={COMMUNITY_URL}
            items={items}
            ctaBlock={ctaBlock}
            topMenuExtra={topMenuExtra}
        >
            {children}
        </SectionLayout>
    );
};

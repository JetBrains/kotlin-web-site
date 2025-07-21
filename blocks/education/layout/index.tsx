import React from 'react';
import { Button } from '@rescui/button';
import { SlackIcon } from '@rescui/icons';
import { SectionLayout } from '../../../components/layout/section-layout';
import { NavigationItem } from '../../../components/layout/layout-types';
import styles from './education-layout.module.css';

/**
 * Education section URL and title
 */
const EDUCATION_URL = '/education/';
const EDUCATION_TITLE = 'Teach';

/**
 * Education section navigation items
 */
const EDUCATION_NAV_ITEMS: NavigationItem[] = [
    {
        url: '/education/',
        title: 'Overview'
    },
    {
        url: '/education/why-teach-kotlin/',
        title: 'Why Teach Kotlin'
    },
    {
        url: '/education/courses/',
        title: 'List of Courses'
    }
];

/**
 * Education layout props interface
 * @deprecated Use SectionLayoutProps from '../../../components/layout/types/layout-types' instead
 */
interface EducationLayoutProps {
    title: string;
    description?: string;
    ogImage?: ImgSrc | string;
    children: React.ReactNode;
}

/**
 * Education layout component
 * This is a wrapper around SectionLayout that maintains backward compatibility
 * while using the new layout architecture
 * 
 * @deprecated Use SectionLayout directly with section="education" instead
 */
export function Index({ title, ogImage, description, children }: EducationLayoutProps) {
    // Create the Join Educators button for the top menu
    const topMenuExtra = (
        <Button
            className={styles.slackButton}
            icon={<SlackIcon />}
            href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators"
            target="_blank"
            rel="noopener noreferrer"
        >
            Join Educators
        </Button>
    );

    // Create the CTA block configuration
    const ctaBlock = {
        topTitle: 'Help us improve',
        mainTitle: (
            <>
                Give us your feedback or ask any questions
                <br />
                you have about teaching Kotlin
            </>
        ),
        buttonText: 'Write to us',
        buttonLink: 'mailto:education@kotlinlang.org'
    };

    return (
        <SectionLayout
            title={title}
            description={description}
            ogImage={ogImage}
            section="education"
            theme="light"
            showHeader={true}
            showFooter={true}
            stickyHeader={true}
            sectionTitle={EDUCATION_TITLE}
            sectionUrl={EDUCATION_URL}
            items={EDUCATION_NAV_ITEMS}
            ctaBlock={ctaBlock}
            topMenuExtra={topMenuExtra}
        >
            {children}
        </SectionLayout>
    );
}
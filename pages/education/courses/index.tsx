import React, { useEffect, useState, useMemo } from 'react';
import { TabList, Tab } from '@rescui/tab-list';
import Button from '@rescui/button';
import { SlackIcon } from '@rescui/icons';
import { CtaBlock } from '@jetbrains/kotlin-web-site-ui/out/components/cta-block-v2';

import { LandingLayout } from '../../../components/landing-layout/landing-layout';
import { CoursesList } from '../../../blocks/education/courses-list';
import { TeachMap, University } from '../../../blocks/education/teach-map';

import styles from './index.module.css';

import '@jetbrains/kotlin-web-site-ui/out/components/typography';
import '@jetbrains/kotlin-web-site-ui/out/components/grid';

const TOP_MENU_ITEMS = [
    { url: '/education/', title: 'Overview' },
    { url: '/education/why-teach-kotlin/', title: 'Why Teach Kotlin' },
    { url: '/education/courses/', title: 'Courses' }
];

interface UniversityData {
    title: string;
    location: string;
    courses: { name: string; url: string }[];
    geo: { lat: number; lng: number };
}

function CoursesPage() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [universitiesData, setUniversitiesData] = useState<UniversityData[] | null>(null);

    useEffect(() => {
        import('../../../data/universities.yml').then((module) => {
            setUniversitiesData(module.default);
        });
    }, []);

    const universities: University[] = useMemo(() => {
        if (!universitiesData) return [];
        return universitiesData.map((university) => ({
            ...university,
            id: `${university.title}-${university.location}-${university.geo.lat}-${university.geo.lng}`
        }));
    }, [universitiesData]);

    return (
        <LandingLayout
            title="List of Courses"
            ogImageName="education.png"
            theme="light"
            topMenuItems={TOP_MENU_ITEMS}
            topMenuTitle="Teach"
            topMenuHomeUrl="/education/"
            currentUrl="/education/"
            currentTitle="Teach"
            topMenuButton={
                <Button
                    icon={<SlackIcon />}
                    href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators"
                    target="_blank"
                    rel="noopener"
                >
                    Join Educators
                </Button>
            }
        >
            <div data-test="teach-courses">
                <section className="ktl-layout ktl-layout--center">
                    <h1 className="ktl-h1 ktl-offset-top-xl">Universities That Teach Kotlin</h1>

                    <div className={`${styles.tabs} ktl-offset-top-m`}>
                        <TabList short value={activeIndex} onChange={setActiveIndex}>
                            <Tab>Table view</Tab>
                            <Tab>Map view</Tab>
                        </TabList>
                    </div>

                    <div className="ktl-offset-top-m">
                        {activeIndex === 1 ? (
                            <TeachMap universities={universities} />
                        ) : (
                            <CoursesList universities={universitiesData || []} />
                        )}
                    </div>
                </section>
            </div>

            <CtaBlock
                topTitle={'If you would like to introduce Kotlin into your classroom or have any questions about teaching or learning Kotlin'}
                buttons={
                    <div className={styles.ctaButtons}>
                        <Button
                            size="l"
                            mode="rock"
                            href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators"
                            target="_blank"
                            rel="noopener"
                        >
                            Slack-channel&nbsp;&rarr;
                        </Button>
                        <Button size="l" mode="rock" href="mailto:education@kotlinlang.org">
                            education@kotlinlang.org
                        </Button>
                    </div>
                }
                mainTitle={'Connect with us'}
            />
        </LandingLayout>
    );
}

export default CoursesPage;

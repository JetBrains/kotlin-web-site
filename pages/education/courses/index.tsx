import React, { useEffect, useState, useMemo } from 'react';
import cn from 'classnames';
import { TabList, Tab } from '@rescui/tab-list';
import { useTextStyles } from '@rescui/typography';

import { EducationLayout } from '../../../blocks/education/education-layout/education-layout';
import { CoursesList } from '../../../blocks/education/courses-list/courses-list';
import { TeachMap, University } from '../../../blocks/education/teach-map/teach-map';

import styles from './index.module.css';

import '@jetbrains/kotlin-web-site-ui/out/components/typography';
import '@jetbrains/kotlin-web-site-ui/out/components/grid';

interface UniversityData {
    title: string;
    location: string;
    courses: { name: string; url: string }[];
    geo: { lat: number; lng: number };
}

function CoursesPage() {
    const textCn = useTextStyles();
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
        <EducationLayout title="List of Courses" dataTestId="teach-courses">
            <section className="ktl-layout ktl-layout--center">
                <h1 className={cn(textCn('rs-h1'), 'ktl-offset-top-xl')}>Universities That Teach Kotlin</h1>

                <div className={cn(styles.tabs, 'ktl-offset-top-m')}>
                    <TabList short value={activeIndex} onChange={setActiveIndex}>
                        <Tab>Table view</Tab>
                        <Tab>Map view</Tab>
                    </TabList>
                </div>

                <div className="ktl-offset-top-m">
                    {activeIndex === 1 ? (
                        <TeachMap universities={universities} />
                    ) : (
                        <CoursesList universities={universities} />
                    )}
                </div>
            </section>
        </EducationLayout>
    );
}

export default CoursesPage;

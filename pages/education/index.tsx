import React from 'react';
import { Button } from '@rescui/button';
import { SlackIcon } from '@rescui/icons';
import { SectionLayout } from '../../components/layout/section-layout';
import { NavigationItem } from '../../components/layout/layout-types';
import { Teach } from '../../blocks/education/teach/teach';
import universitiesDataRaw from '../../data/universities.yml';

import ogImage from '../../assets/images/open-graph/education.png'

// Education section URL and title
const EDUCATION_URL = '/education/';
const EDUCATION_TITLE = 'Teach';

// Education section navigation items
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

const SOCIAL_DESCRIPTION = 'Kotlin is a modern programming language that is concise, safe, and fully interoperable with Java. Learn how to teach Kotlin in your computer science courses.' as const;

type EducationPageProps = {
    universitiesCount: number;
    countriesCount: number;
}

export default function EducationPage({ universitiesCount, countriesCount }: EducationPageProps) {
    // Create the Join Educators button for the top menu
    const topMenuExtra = (
        <Button
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
            title="Kotlin for Education"
            description={SOCIAL_DESCRIPTION}
            ogImage={ogImage}
            sectionTitle={EDUCATION_TITLE}
            sectionUrl={EDUCATION_URL}
            items={EDUCATION_NAV_ITEMS}
            ctaBlock={ctaBlock}
            topMenuExtra={topMenuExtra}
        >
            <Teach
                universitiesCount={universitiesCount}
                countriesCount={countriesCount}
            />
        </SectionLayout>
    );
}

function getCountriesCount(universities: UniversitiesData): number {
    const countries = new Set<string>();

    for (const university of universities) {
        const location = university.location;
        const country = location.split(',').pop()?.trim();
        if (country) countries.add(country);
    }

    return countries.size;
}

type UniversitiesData = {
    title: string;
    location: string;
    courses: { name: string; url: string; }[];
}[];

export async function getStaticProps() {
    const universitiesData: UniversitiesData = universitiesDataRaw;

    return {
        props: {
            universitiesCount: universitiesData.length,
            countriesCount: getCountriesCount(universitiesData)
        }
    };
}

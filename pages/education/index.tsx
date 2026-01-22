import React, { useEffect, useState, useMemo } from 'react';
import { useTextStyles } from '@rescui/typography';
import Button from '@rescui/button';
import { SlackIcon } from '@rescui/icons';
import YoutubePlayer from '@jetbrains/kotlin-web-site-ui/out/components/youtube-player';
import { CtaBlock } from '@jetbrains/kotlin-web-site-ui/out/components/cta-block-v2';

import { LandingLayout } from '../../components/landing-layout/landing-layout';
import { TeachNumbers } from '../../blocks/education/teach-numbers';
import { TeachQuotes } from '../../blocks/education/teach-quotes';
import { TeachMap, University } from '../../blocks/education/teach-map';
import { TeachLaunchCourse } from '../../blocks/education/teach-launch-course';
import { SubscriptionForm } from '../../blocks/education/subscription-form';

import styles from './index.module.css';

import '@jetbrains/kotlin-web-site-ui/out/components/typography';
import '@jetbrains/kotlin-web-site-ui/out/components/grid';

const TOP_MENU_ITEMS = [
    { url: '/education/', title: 'Overview' },
    { url: '/education/why-teach-kotlin/', title: 'Why Teach Kotlin' },
    { url: '/education/courses/', title: 'List of Courses' }
];

interface UniversityData {
    title: string;
    location: string;
    courses: { name: string; url: string }[];
    geo: { lat: number; lng: number };
}

function extractCountry(location: string): string {
    const parts = location.split(',');
    return parts[parts.length - 1].trim();
}

function EducationPage() {
    const textCn = useTextStyles();
    const [universitiesData, setUniversitiesData] = useState<UniversityData[] | null>(null);

    useEffect(() => {
        import('../../data/universities.yml').then((module) => {
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

    const universitiesCount = universitiesData?.length ?? 0;
    const countriesCount = useMemo(() => {
        if (!universitiesData) return 0;
        return new Set(universitiesData.map((u) => extractCountry(u.location))).size;
    }, [universitiesData]);

    return (
        <LandingLayout
            title="Kotlin for Education"
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
            <div className={styles.wrapper} data-test="teach-index-page">
                <section className="ktl-layout ktl-layout--center ktl-offset-top-xl">
                    <h1 className="ktl-hero ktl-offset-bottom-xxl">Teach Computer Science with&nbsp;Kotlin</h1>

                    <TeachLaunchCourse />

                    <div className={styles.topMobileButtons}>
                        <Button
                            icon={<SlackIcon />}
                            href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators"
                            target="_blank"
                            rel="noopener"
                        >
                            Join Educators Community
                        </Button>

                        <Button mode="outline" href="/education/why-teach-kotlin/">
                            Why Teach Kotlin&nbsp;&rarr;
                        </Button>
                    </div>

                    <div className={`${styles.features} ktl-row ktl-offset-top-l`}>
                        <div className="ktl-col-12 ktl-col-md-4">
                            <div className={styles.feature}>
                                <div className={`${styles.featureIcon} ktl-offset-bottom-m`}>
                                    <img
                                        src="/images/education/icons/teach-academically-recognized-icon.svg"
                                        alt="Academically recognized"
                                    />
                                </div>
                                <div className={styles.featureContent}>
                                    <div className={`${textCn('rs-h3')} ktl-offset-bottom-s`}>Academically recognized</div>
                                    <div className="ktl-text-2">
                                        Over 300 of the world's top universities include Kotlin in various computer
                                        science courses (as of June 2023).
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ktl-col-12 ktl-col-md-4">
                            <div className={styles.feature}>
                                <div className={`${styles.featureIcon} ktl-offset-bottom-m`}>
                                    <img
                                        src="/images/education/icons/teach-popular-icon.svg"
                                        alt="Language of the industry"
                                    />
                                </div>
                                <div className={styles.featureContent}>
                                    <div className={`${textCn('rs-h3')} ktl-offset-bottom-s`}>Language of the industry</div>
                                    <div className="ktl-text-2">
                                        Kotlin is used by top companies such as Google, Amazon, Twitter, Reddit,
                                        Netflix, Uber, Slack, just to name a few.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ktl-col-12 ktl-col-md-4">
                            <div className={styles.feature}>
                                <div className={`${styles.featureIcon} ktl-offset-bottom-m`}>
                                    <img
                                        src="/images/education/icons/teach-multiplatform-icon.svg"
                                        alt="Multiplatform"
                                    />
                                </div>
                                <div className={styles.featureContent}>
                                    <div className={`${textCn('rs-h3')} ktl-offset-bottom-s`}>Multiplatform</div>
                                    <div className="ktl-text-2">
                                        Kotlin is a top choice for teaching Android development. It is also being
                                        adopted for teaching multiplatform development, web, server-side programming,
                                        data science, and other computer science topics.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ktl-offset-top-l">
                        <div className={styles.topButtons}>
                            <Button
                                size="l"
                                icon={<SlackIcon />}
                                href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators"
                                target="_blank"
                                rel="noopener"
                            >
                                Join Educators Community
                            </Button>

                            <Button size="l" mode="outline" href="/education/why-teach-kotlin/">
                                Why Teach Kotlin&nbsp;&rarr;
                            </Button>
                        </div>
                    </div>
                </section>

                <section
                    className={`${styles.universities} ktl-offset-top-xxl ktl-with-anchor`}
                    id="kotlin-courses-around-the-world"
                >
                    <div className="ktl-layout ktl-layout--center">
                        <div className={styles.universitiesTop}>
                            <div className={styles.universitiesTopInner}>
                                <div className={styles.universitiesTopTitle}>
                                    <h2 className="ktl-h1">
                                        <a
                                            href="#kotlin-courses-around-the-world"
                                            className="kto-anchor-link kto-anchor-link--small"
                                        >
                                            Kotlin Courses Around the World
                                        </a>
                                    </h2>

                                    <p className="ktl-text-1 ktl-offset-top-l">
                                        Explore our interactive map with links to university courses that
                                        <br /> include Kotlin.
                                    </p>
                                </div>

                                <h2 className={`ktl-h1 ${styles.universitiesTopTitleMobile}`}>
                                    Kotlin is taught at {universitiesCount} universities
                                </h2>

                                <div className={styles.universitiesTopNumbers}>
                                    <TeachNumbers countriesCount={countriesCount} universitiesCount={universitiesCount} />
                                </div>
                            </div>
                        </div>

                        <div className={`${styles.universitiesLogos} ktl-offset-top-m`}>
                            <div className={styles.logos}>
                                <div className={styles.logosItem}>
                                    <img
                                        className={styles.logosHopkins}
                                        src="/images/education/universities/harvard.jpg"
                                        alt="Harvard University"
                                    />
                                </div>
                                <div className={styles.logosItem}>
                                    <img
                                        className={styles.logosCambridge}
                                        src="/images/education/universities/cambridge.png"
                                        alt="University of Cambridge"
                                    />
                                </div>
                                <div className={styles.logosItem}>
                                    <img
                                        className={styles.logosStanford}
                                        src="/images/education/universities/stanford.png"
                                        alt="Stanford University"
                                    />
                                </div>
                                <div className={styles.logosItem}>
                                    <img
                                        className={styles.logosImperial}
                                        src="/images/education/universities/imperial.png"
                                        alt="Imperial College London"
                                    />
                                </div>
                                <div className={styles.logosItem}>
                                    <img
                                        className={styles.logosChicago}
                                        src="/images/education/universities/uchicago.png"
                                        alt="The University of Chicago"
                                    />
                                </div>
                            </div>
                        </div>

                        <TeachMap className={styles.mapWrapper} universities={universities} />

                        <div className={`${styles.universitiesBottom} ktl-offset-top-m`}>
                            <div className="ktl-row">
                                <div className="ktl-col-12 ktl-col-sm-8 ktl-col-sm-offset-2">
                                    <p className="ktl-text-2 ktl-offset-bottom-m">
                                        To add your university's Kotlin course to the map, contact us at{' '}
                                        <a href="mailto:education@kotlinlang.org" className="rs-link">
                                            education@kotlinlang.org.
                                        </a>{' '}
                                        <br />
                                        We'll send you a Kotlin T-shirt and stickers for your students.
                                    </p>
                                    <Button size="l" mode="outline" href="/education/courses/">
                                        All universities
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.universitiesMobileButton}>
                            <Button mode="outline" href="/education/courses/">
                                Learn more&nbsp;&rarr;
                            </Button>
                        </div>
                    </div>
                </section>

                <section className={`${styles.resources} ktl-offset-top-xxl ktl-with-anchor`} id="start-teaching-kotlin">
                    <div className="ktl-layout ktl-layout--center">
                        <div className={`${styles.resourcesTop} ktl-offset-bottom-xl`}>
                            <img
                                className={styles.resourcesTopImage}
                                src="/images/education/icons/education-main.png"
                                alt="Kotlin resources"
                            />
                            <h2 className="ktl-h1">
                                <a href="#start-teaching-kotlin" className="kto-anchor-link kto-anchor-link--small">
                                    Start Teaching Kotlin
                                    <br /> with These Resources
                                </a>
                            </h2>
                        </div>
                        <ul className={styles.links}>
                            <li className={styles.linksFirstList}>
                                <p className="ktl-h4 ktl-offset-bottom-xs">Get started</p>
                                <ul className={styles.list}>
                                    <li className={styles.listItem}>
                                        <a href="/docs/kotlin-tour-welcome.html" className={textCn('rs-link', { external: true })}>

       Tour of Kotlin
                                        </a>
                                    </li>
                                    <li className={styles.listItem}>
                                        <a
                                            href="https://jb.gg/academy/kotlin-onboarding"
                                            className={textCn('rs-link', { external: true })}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Kotlin Onboarding: Introduction
                                        </a>
                                    </li>
                                    <li className={styles.listItem}>
                                        <a
                                            href="https://jb.gg/academy/kotlin-oop"
                                            className={textCn('rs-link', { external: true })}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Kotlin Onboarding: Object-Oriented Programming
                                        </a>
                                    </li>
                                    <li className={styles.listItem}>
                                        <a
                                            href="https://jb.gg/academy/kotlin-collections"
                                            className={textCn('rs-link', { external: true })}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Kotlin Onboarding: Collections
                                        </a>
                                    </li>
                                    <li className={styles.listItem}>
                                        <a
                                            href="https://jb.gg/refactoring-kotlin"
                                            className={textCn('rs-link', { external: true })}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Introduction to IDE Code Refactoring in Kotlin
                                        </a>
                                    </li>
                                    <li className={styles.listItem}>
                                        <a
                                            href="https://jb.gg/academy/kotlin-algorithm"
                                            className={textCn('rs-link', { external: true })}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Algorithmic Challenges in Kotlin
                                        </a>
                                    </li>

                                    <li className={styles.listItem}>
                                        <div className="ktl-text-2 ktl-dimmed-text">Atomic Kotlin:</div>
                                        <ul className={`${styles.list} ${styles.sublist}`}>
                                            <li className={styles.listItem}>
                                                <a
                                                    href="https://www.atomickotlin.com/exercises/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={textCn('rs-link', { external: true })}
                                                >
                                                    Hands-on exercises
                                                </a>
                                            </li>
                                            <li className={styles.listItem}>
                                                <a
                                                    href="https://github.com/svtk/AtomicKotlinCourse"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={textCn('rs-link', { external: true })}
                                                >
                                                    Course project
                                                </a>
                                            </li>
                                            <li className={styles.listItem}>
                                                <a
                                                    href="https://www.jetbrains.com/help/education/educator-start-guide.html"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={textCn('rs-link', { external: true })}
                                                >
                                                    Educator start guide
                                                </a>
                                            </li>
                                        </ul>
                                    </li>

                                    <li className={styles.listItem}>
                                        <a
                                            href="https://docs.google.com/document/d/1XIJaV3zhn-tJhDc_6Kr00lmTo5zCBuES3Yt67wX752M/edit"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={textCn('rs-link', { external: true })}
                                        >
                                            Kotlin curriculum for beginners
                                        </a>
                                    </li>

                                    <li className={styles.listItem}>
                                        <a
                                            href="https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-education&utm_content=button_1&utm_term=22.03.23"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={textCn('rs-link', { external: true })}
                                        >
                                            Kotlin tracks by JetBrains Academy
                                        </a>
                                    </li>
                                </ul>
                            </li>

                            <li className={styles.linksSecondList}>
                                <p className="ktl-h4 ktl-offset-bottom-xs">Tools</p>
                                <ul className={styles.list}>
                                    <li className={styles.listItem}>
                                        <a
                                            href="https://www.jetbrains.com/community/education/#students"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={textCn('rs-link', { external: true })}
                                        >
                                            Free educational licenses for students and teachers
                                        </a>
                                    </li>
                                    <li className={styles.listItem}>
                                        <a
                                            href="https://plugins.jetbrains.com/plugin/10081-jetbrains-academy"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={textCn('rs-link', { external: true })}
                                        >
                                            JetBrains Academy plugin
                                        </a>
                                    </li>
                                    <li className={styles.listItem}>
                                        <a
                                            href="/docs/mixing-java-kotlin-intellij.html#convert-java-files-to-kotlin"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={textCn('rs-link', { external: true })}
                                        >
                                            Java-to-Kotlin converter
                                        </a>
                                    </li>
                                    <li className={styles.listItem}>
                                        <a
                                            href="https://www.jetbrains.com/code-with-me/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={textCn('rs-link', { external: true })}
                                        >
                                            Code With Me
                                        </a>
                                    </li>
                                </ul>
                            </li>

                            <li className={styles.linksThirdList}>
                                <p className="ktl-h4 ktl-offset-bottom-xs">Online Courses</p>
<ul className={styles.list}>
                         <li className={styles.listItem}>
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://www.oreilly.com/library/view/introduction-to-kotlin/9781491964125/"
                                            className={textCn('rs-link', { external: true })}
                                        >
                                            Introduction to Kotlin Programming
                                        </a>
                                    </li>
                                    <li className={styles.listItem}>
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://www.oreilly.com/library/view/advanced-kotlin-programming/9781491964149/"
                                            className={textCn('rs-link', { external: true })}
                                        >
                                            Advanced Kotlin
                                        </a>
                                    </li>
                                    <li className={styles.listItem}>
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://www.coursera.org/learn/kotlin-for-java-developers"
                                            className={textCn('rs-link', { external: true })}
                                        >
                                            Programming Kotlin for Java Developers
                                        </a>
                                    </li>
                                </ul>
                            </li>

                            <li className={styles.linksFourthList}>
                                <p className="ktl-h4 ktl-offset-bottom-xs">Android in Kotlin</p>
                                <ul className={styles.list}>
                                    <li className={styles.listItem}>
                                        <a
                                            href="https://developer.android.com/courses/android-basics-compose/course"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={textCn('rs-link', { external: true })}
                                        >
                                            Android Basics with Compose course
                                        </a>
                                    </li>

                                    <li className={styles.listItem}>
                                        <a
                                            href="https://developer.android.com/teach"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={textCn('rs-link', { external: true })}
                                        >
                                            Android Development with Kotlin course
                                        </a>
                                    </li>
                                </ul>
                            </li>

                            <li className={styles.linksFifthList}>
                                <p className="ktl-h4 ktl-offset-bottom-xs">Practice Kotlin</p>
                                <ul className={styles.list}>
                                    <li className={styles.listItem}>
                                        <a href="https://play.kotlinlang.org/koans/overview" className={textCn('rs-link')}>
                                            Koans
                                        </a>
                                    </li>
                                    <li className={styles.listItem}>
                                        <a href="https://kotlinlang.org/lp/kotlin-heroes/" className={textCn('rs-link')}>
                                            Kotlin Heroes
                                        </a>
                                    </li>
                                    <li className={styles.listItem}>
                                        <a href="/docs/advent-of-code.html" className={textCn('rs-link')}>
                                            Solve Advent of Code Puzzles
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className={`ktl-layout ktl-layout--center ktl-offset-top-xxl ${styles.subscriptionSection}`}>
                    <SubscriptionForm />
                </section>

                <section className={`${styles.video} ktl-offset-top-xxl`}>
                    <div className="ktl-layout ktl-layout--center">
                        <div className="ktl-row">
                            <div className="ktl-col">
                                <YoutubePlayer
                                    mode={1}
                                    id="PLlFc5cFwUnmzT4cgLOGJYGnY6j0W2xoFA"
                                    previewImgSrc="https://img.youtube.com/vi/CQlBQ5tfbHE/maxresdefault.jpg"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="ktl-layout ktl-layout--center ktl-offset-top-xxl">
                    <div className="ktl-row">
                        <div className="ktl-col-12 ktl-col-md-10 ktl-col-md-offset-1">
                            <TeachQuotes />
                        </div>
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

export default EducationPage;

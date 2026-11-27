import React from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { createTextCn } from '@rescui/typography';

import { NewsletterForm } from '@/blocks/kotlin-security-newsletter/newsletter-form';
import styles from '@/blocks/kotlin-security-newsletter/newsletter.module.css';
import { LandingLayout } from '@/components/landing-layout/landing-layout';
import cubeGraphics from '@/public/images/state-of-kotlin-2026/deco-cube.webp';
import sphereGraphics from '@/public/images/state-of-kotlin-2026/deco-sphere.webp';

const TITLE = 'Kotlin Security Newsletter';
const DESCRIPTION =
    'A free email digest from the Kotlin team to help you find the security fixes that matter to your projects.';
const textCn = createTextCn('light');

const COVERAGE = [
    {
        title: 'Kotlin ecosystem security updates',
        description:
            'Fixed CVEs, affected versions, and dependency updates for Kotlin, the kotlinx libraries, Ktor, and Exposed.',
    },
    {
        title: 'JVM security news relevant to Kotlin',
        description:
            'When a JDK vulnerability or a compromised dependency affects Kotlin projects, we’ll explain what’s affected and link to any published fix or workaround.',
    },
    {
        title: 'Kotlin security events',
        description:
            'We’ll occasionally share details about invite-only online or in-person sessions, including the topic and how to join.',
    },
];

const RESOURCES = [
    {
        title: 'Public security support policy',
        href: 'https://kotlinlang.org/docs/releases.html#standard-library-security-support',
        description:
            'The Kotlin standard library for the JVM receives 18 months of security support per release line, starting with Kotlin 2.4.',
    },
    {
        title: 'How to report a Kotlin vulnerability',
        href: 'https://kotlinlang.org/docs/security.html',
        description:
            'Follow the instructions to report a potential vulnerability privately through YouTrack or by email.',
    },
];

export default function KotlinSecurityNewsletter() {
    return (
        <LandingLayout title={TITLE} description={DESCRIPTION} theme="light" hideTopMenu>
            <main>
                <section className={styles.hero} aria-labelledby="newsletter-title">
                    <div className={cn('ktl-layout-v2', 'ktl-layout--center', styles.container, styles.heroContent)}>
                        <div>
                            <h1 id="newsletter-title" className={cn(textCn('rs-hero'), styles.title)}>
                                {TITLE}
                            </h1>
                            <NewsletterForm />
                        </div>
                        <div className={styles.artwork} aria-hidden="true">
                            <Image
                                src={cubeGraphics}
                                alt=""
                                sizes="(max-width: 640px) 84px, 280px"
                                className={styles.cube}
                            />
                            <Image
                                src={sphereGraphics}
                                alt=""
                                sizes="(max-width: 640px) 48px, 168px"
                                className={styles.sphere}
                            />
                        </div>
                    </div>
                </section>

                <section className={styles.section} aria-labelledby="newsletter-coverage">
                    <div className={cn('ktl-layout-v2', 'ktl-layout--center', styles.container)}>
                        <h2 id="newsletter-coverage" className={cn(textCn('rs-h2'), styles.heading)}>
                            What you’ll get
                        </h2>
                        <ul className={styles.items} role="list">
                            {COVERAGE.map(({ title, description }) => (
                                <li key={title} className={styles.card}>
                                    <h3 className={cn(textCn('rs-h4'), styles.itemTitle)}>{title}</h3>
                                    <p
                                        className={cn(
                                            textCn('rs-text-2', { hardness: 'average' }),
                                            styles.itemDescription
                                        )}
                                    >
                                        {description}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section className={cn(styles.section, styles.resources)} aria-labelledby="security-resources">
                    <div className={cn('ktl-layout-v2', 'ktl-layout--center', styles.container)}>
                        <h2 id="security-resources" className={cn(textCn('rs-h2'), styles.heading)}>
                            More Kotlin security resources
                        </h2>
                        <ul className={styles.items} role="list">
                            {RESOURCES.map(({ title, href, description }) => (
                                <li key={title} className={styles.resource}>
                                    <h3 className={cn(textCn('rs-h4'), styles.itemTitle)}>
                                        <a href={href} className={textCn('rs-link')}>
                                            {title}
                                        </a>
                                    </h3>
                                    <p
                                        className={cn(
                                            textCn('rs-text-2', { hardness: 'average' }),
                                            styles.itemDescription
                                        )}
                                    >
                                        {description}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </main>
        </LandingLayout>
    );
}

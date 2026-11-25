import React, { FC, ReactNode } from 'react';
import Head from 'next/head';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import { LandingLayout } from '@/components/landing-layout/landing-layout';
import { KOTLIN_LTS_TITLE, KOTLIN_LTS_URL } from '../constants';
import shared from '../kotlin-lts.module.css';
import styles from './forms.module.css';

type FormLayoutProps = {
    title: string;
    eyebrow?: string;
    intro?: string;
    artwork?: ReactNode;
    children: ReactNode;
};

export const FormLayout: FC<FormLayoutProps> = ({ title, eyebrow, intro, artwork, children }) => {
    const textCn = useTextStyles();

    return (
        <LandingLayout
            title={`${title} | Kotlin LTS`}
            theme="light"
            footerTheme="light"
            topMenuTitle={KOTLIN_LTS_TITLE}
            topMenuHomeUrl={KOTLIN_LTS_URL}
            topMenuItems={[{ title: 'Support overview', url: KOTLIN_LTS_URL }]}
        >
            <Head>
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <main className="ktl-layout-to-2">
                <section className={cn(shared.section, artwork ? styles.newsletterSection : shared.light)} aria-labelledby="lts-form-title">
                    <div className={cn('ktl-layout', 'ktl-layout--center', artwork && styles.newsletterLayout)}>
                        <div>
                            {eyebrow && <p className={cn(textCn('rs-text-2'), shared.eyebrow)}>{eyebrow}</p>}
                            <h1 id="lts-form-title" className={cn(textCn('rs-h1'), shared.title)}>
                                {title}
                            </h1>
                            {intro && <p className={cn(textCn('rs-text-1', { hardness: 'average' }), shared.lead)}>{intro}</p>}
                            <div className={styles.formContent}>
                                <noscript>Enable JavaScript to use this form.</noscript>
                                {children}
                            </div>
                        </div>
                        {artwork && <div className={styles.newsletterArtwork} aria-hidden="true">{artwork}</div>}
                    </div>
                </section>
            </main>
        </LandingLayout>
    );
};

import React, { FC } from 'react';
import Button from '@rescui/button';
import { SlackIcon } from '@rescui/icons';
import { CtaBlock } from '@jetbrains/kotlin-web-site-ui/out/components/cta-block-v2';

import { LandingLayout } from '../../../components/landing-layout/landing-layout';

import styles from './education-layout.module.css';

const MENU_ITEMS = [
    { url: '/education/', title: 'Overview' },
    { url: '/education/why-teach-kotlin/', title: 'Why Teach Kotlin' },
    { url: '/education/courses/', title: 'List of Courses' }
];

export type EducationLayoutProps = {
    title: string;
    children: React.ReactNode;
    dataTestId?: string;
};

export const EducationLayout: FC<EducationLayoutProps> = ({
    title,
    children,
    dataTestId
}) => {
    return (
        <LandingLayout
            title={title}
            ogImageName="education.png"
            theme="light"
            topMenuItems={MENU_ITEMS}
            topMenuTitle="Teach"
            topMenuHomeUrl="/education/"
            currentUrl="/education/"
            currentTitle="Teach"
            mobileOverview={false}
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
            <div className={styles.wrapper} data-test={dataTestId}>
                {children}
            </div>

            <CtaBlock
                className={'cta-block'}
                topTitle={
                    'If you would like to introduce Kotlin into your classroom or have any questions about teaching or learning Kotlin'
                }
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
};

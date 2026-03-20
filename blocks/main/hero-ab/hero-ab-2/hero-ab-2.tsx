import React, { FC } from 'react';
import { Button } from '@rescui/button';
import cn from 'classnames';
import { ArrowRightIcon } from '@rescui/icons';

import { createTextCn } from '@rescui/typography';

import styles from './hero-ab-2.module.css';

import JBLogo from '../../../../assets/jetbrains-logo.svg';
import { HeroLayout } from '../components/layout/layout';

interface Props {
}

export const HeroSectionAB2: FC<Props> = ({}) => {
    const darkTextCn = createTextCn('dark');

    return (
        <HeroLayout>
            <div className={styles.grid}>
                <div className={styles.content}>
                    <h1 className={cn(darkTextCn('rs-super-hero'), styles.heroText)}>Kotlin</h1>
                    <p className={cn(darkTextCn('rs-subtitle-1'), styles.subtitle)}>Concise. Multiplatform.
                        Fun.</p>

                    <div className={styles.developer}>
                        <div className={styles.developerContent}>
                            <div
                                className={cn(darkTextCn('rs-text-2', { hardness: 'hard' }), styles.developerCaption)}>Developed
                                by
                            </div>
                            <a
                                href="https://www.jetbrains.com/"
                                target={'_blank'}
                                rel={'noreferrer noopener'}
                            >
                                <img src={JBLogo.src} alt="jetbrains logo"
                                     className={styles.developerLogo} />{' '}
                            </a>
                        </div>
                    </div>

                    variant 2

                    <div className={styles.kotlinTour}>
                        <div className={styles.kotlinTourTitle}>
                            <h3 className={cn(darkTextCn('rs-h3'), styles.kotlinTourTitle)}>Start Kotlin tour</h3>
                        </div>
                        <div>
                            <Button size='m' mode={'outline'} icon={<ArrowRightIcon />} iconPosition={'right'}>Quick Start</Button>
                        </div>
                    </div>

                </div>
            </div>
        </HeroLayout>
    );
};

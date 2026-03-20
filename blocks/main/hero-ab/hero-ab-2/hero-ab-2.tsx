import React, { FC } from 'react';
import { Button } from '@rescui/button';
import cn from 'classnames';
import { ArrowRightIcon } from '@rescui/icons';

import { createTextCn } from '@rescui/typography';

import styles from './hero-ab-2.module.css';

import { HeroLayout } from '../components/layout/layout';
import { Developer } from '../components/developer/developer';

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

                    <Developer />

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

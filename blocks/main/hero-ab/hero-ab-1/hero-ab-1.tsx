import React, { FC, ReactNode } from 'react';
import { Button } from '@rescui/button';
import cn from 'classnames';
import { ArrowRightIcon } from '@rescui/icons';

import { createTextCn } from '@rescui/typography';
import { ThemeProvider } from '@rescui/ui-contexts';

import '@jetbrains/kotlin-web-site-ui/out/components/layout';

import styles from './hero-ab-1.module.css';

import { HeroPlatforms } from '../components/hero-platforms/hero-platforms';
import { Developer } from '../components/developer/developer';


import { HeroLayout } from '@/blocks/main/hero-ab/components/layout/layout';

interface Props {
}

export const HeroSectionAB1: FC<Props> = ({}) => {
    const darkTextCn = createTextCn('dark');

    return (
        <ThemeProvider theme={'dark'}>
            <HeroLayout>
                <div className={styles.grid}>
                    <div className={styles.content}>
                        <h1 className={cn(darkTextCn('rs-super-hero'), styles.heroText)}>Kotlin</h1>
                        <p className={cn(darkTextCn('rs-subtitle-1'), styles.subtitle)}>Concise. Multiplatform.
                            Fun.</p>

                        <Developer />


                        <div className={styles.heroPlatforms}>
                            <HeroPlatforms />
                        </div>

                        <div className={styles.kotlinTour}>
                            <div className={styles.kotlinTourTitle}>
                                <h3 className={cn(darkTextCn('rs-h3'), styles.kotlinTourTitle)}>Start Kotlin tour</h3>
                            </div>
                            <div>
                                <Button size="m" mode={'outline'} icon={<ArrowRightIcon />} iconPosition={'right'}>Quick
                                    Start</Button>
                            </div>
                        </div>

                    </div>
                </div>
            </HeroLayout>
        </ThemeProvider>
    );
};

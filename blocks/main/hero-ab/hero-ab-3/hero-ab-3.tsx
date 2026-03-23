import React, { FC } from 'react';
import cn from 'classnames';

import { Button } from '@rescui/button';

import { createTextCn } from '@rescui/typography';
import { ThemeProvider } from '@rescui/ui-contexts';


import styles from './hero-ab-3.module.css';
import { HeroLayout } from '../components/layout/layout';

import { Developer } from '../components/developer/developer';
import { Playground } from '../components/playground/playground';


interface Props {
}

export const HeroSectionAB3: FC<Props> = ({}) => {
    const darkTextCn = createTextCn('dark');

    return (
        <ThemeProvider theme={'dark'}>
            <HeroLayout>
                <div className={styles.wrapper}>

                    <div className={styles.heading}>
                        <h1 className={cn(darkTextCn('rs-middle-hero'), styles.heroText)}>Kotlin</h1>
                        <p className={cn(darkTextCn('rs-subtitle-1'), styles.subtitle)}>Concise. Multiplatform.
                            Fun.</p>

                        <Developer />
                    </div>

                    <div className={styles.navItems}>
                        <a className={styles.navItem} href={'/'}>
                            <p className={darkTextCn('rs-text-2', {hardness: 'hard'})}>Multiplatform</p>
                        </a>
                        <a className={styles.navItem} href={'/'}>
                            <p className={darkTextCn('rs-text-2', {hardness: 'hard'})}>AI</p>
                        </a>
                        <a className={styles.navItem} href={'/'}>
                            <p className={darkTextCn('rs-text-2', {hardness: 'hard'})}>Backend</p>
                        </a>
                        <a className={styles.navItem} href={'/'}>
                            <p className={darkTextCn('rs-text-2', {hardness: 'hard'})}>Android</p>
                        </a>
                        <a className={styles.navItem} href={'/'}>
                            <div className={styles.kotlinTour}>
                                <p className={darkTextCn('rs-text-2', {hardness: 'hard'})}>Kotlin Tour</p>
                                <Button size="m" mode={'outline'}>Quick Start</Button>
                            </div>
                        </a>
                    </div>

                    <Playground />

                </div>
            </HeroLayout>
        </ThemeProvider>
    );
};

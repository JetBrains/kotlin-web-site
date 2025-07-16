import React, { FC } from 'react';

import cn from 'classnames';

import styles from './hero.module.css';
import { useTextStyles } from '@rescui/typography';

import '@jetbrains/kotlin-web-site-ui/out/components/layout';

import { Button } from '@rescui/button';

import Img from 'next/image';

import heroImg from '../../../public/images/server-side/server-side-hero.webp'

export const ServerSideHero: FC = ({}) => {

    const textCn = useTextStyles();

    return (
        <div className={styles.wrapper}>

            <Img className={styles.heroImage} src={heroImg} alt={'Server-side graphic'}></Img>

            <div className={cn('ktl-layout', 'ktl-layout--center')}>
                <div className={styles.content}>
                    <h1 className={cn(textCn('rs-hero'), styles.heroTitle)}>
                        Modern backend<br /> development on JVM<br /> with Kotlin
                    </h1>

                    <p className={cn(textCn('rs-subtitle-2'), styles.heroSubtitle)}>
                        Kotlin is a modern, pragmatic language built<br />
                        for backend development. It gives you:
                    </p>

                    <div className={styles.featuresList}>

                        <div className={styles.feature}>
                            <p className={cn(textCn('rs-subtitle-2'), styles.featureTitle)}>Safety</p>
                        </div>
                        <div className={styles.feature}>
                            <p className={cn(textCn('rs-subtitle-2'), styles.featureTitle)}>Runtime performance</p>
                        </div>
                        <div className={styles.feature}>
                            <p className={cn(textCn('rs-subtitle-2'), styles.featureTitle)}>Access to the rich JVM ecosystem</p>
                        </div>
                        <div className={styles.feature}>
                            <p className={cn(textCn('rs-subtitle-2'), styles.featureTitle)}>Great developer experience</p>
                        </div>

                    </div>

                    <div className={styles.buttons}>
                        <Button mode={'rock'} size={'l'}>Get started</Button>
                        <Button mode={'outline'} size={'l'}>Who uses Kotlin</Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

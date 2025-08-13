import React, { FC } from 'react';

import cn from 'classnames';

import styles from './hero.module.css';
import { useTextStyles } from '@rescui/typography';

import '@jetbrains/kotlin-web-site-ui/out/components/layout';

import { Button } from '@rescui/button';

import Img from 'next/image';
import Link from 'next/link';

import heroImg from './images/hero-graphics.webp'

export const ServerSideHero: FC = ({}) => {

    const textCn = useTextStyles();

    return (
        <div className={styles.wrapper} data-testid={'hero-block'}>

            <Img className={styles.heroImage} src={heroImg} alt={'Server-side graphic'} width={1000} height={1000} />

            <div className={cn('ktl-layout', 'ktl-layout--center')}>
                <div className={styles.content}>
                    <h1 className={cn(textCn('rs-hero'), styles.heroTitle)} data-testid={'hero-block-title'}>
                        Modern backend<br /> development <br /> with Kotlin
                    </h1>

                    <p className={cn(textCn('rs-subtitle-2'), styles.heroSubtitle)} data-testid={'hero-block-subtitle'}>
                        Kotlin is a perfect fit for building backends on JVM. It's trusted by major tech companies to build scalable and reliable server-side applications
                    </p>

                    <div className={styles.featuresList}>

                        <Link href={'#safety'} className={styles.feature} data-testid={'hero-block-anchor'}>
                            <p className={cn(textCn('rs-subtitle-2'), styles.featureTitle)}>Safety</p>
                        </Link>
                        <Link href={'#performance'} className={styles.feature} data-testid={'hero-block-anchor'}>
                            <p className={cn(textCn('rs-subtitle-2'), styles.featureTitle)}>Runtime performance</p>
                        </Link>
                        <Link href={'#ecosystem'} className={styles.feature} data-testid={'hero-block-anchor'}>
                            <p className={cn(textCn('rs-subtitle-2'), styles.featureTitle)}>Access to the rich JVM ecosystem</p>
                        </Link>
                        <Link href={'#tools'} className={styles.feature} data-testid={'hero-block-anchor'}>
                            <p className={cn(textCn('rs-subtitle-2'), styles.featureTitle)}>Great developer experience</p>
                        </Link>

                    </div>

                    <div className={styles.buttons}>
                        <Button mode={'rock'} size={'l'} href={'#get-started'} data-testid={'hero-block-get-started-link'}>Get started</Button>
                        <Button mode={'outline'} size={'l'} href={'https://kotlinlang.org/lp/server-side/case-studies/'} data-testid={'hero-block-case-studies-link'}>Who uses Kotlin</Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

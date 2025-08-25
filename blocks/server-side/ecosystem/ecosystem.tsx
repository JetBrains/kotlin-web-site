import React, { FC } from 'react';

import cn from 'classnames';

import styles from './ecosystem.module.css';
import { useTextStyles } from '@rescui/typography';
import { Tag, presets } from '@rescui/tag';

import { Card } from '../card/card';

import { primaryCardsData, secondaryCardsData } from './ecosystem-data';

import Link from 'next/link';

export const Ecosystem: FC = ({}) => {

    const textCn = useTextStyles();

    return (
        <section className="ktl-layout ktl-layout--center">
            <div className="ktl-container section-offset" id={'ecosystem'}>

                <h2 className={cn(textCn('rs-h1'))}>
                    Rich JVM ecosystem for backend development
                </h2>

                <div className={cn(styles.cards)}>
                    <Card
                        title={'Seamless Java integration'}
                        description={'Full interop with Java allows using any JVM library or framework'}
                    />

                    <Card
                        title={'Enhanced Java frameworks with Kotlin'}
                        description={'Kotlin takes frameworks that were originally written in Java and enhances them with expressive features, making the API clearer and more intuitive'}
                    />

                    <Card
                        title={'Gradual Kotlin adoption'}
                        description={'100% interoperability between Java and Kotlin allows you to adopt Kotlin incrementally and on your own terms'}
                    />

                    <Card
                        title={'Rich framework ecosystem'}
                        description={'Quickly develop backend solutions with the most popular frameworks, including Spring, Hibernate, Ktor, Koog, MCP Kotlin SDK, and others.'}
                    />
                </div>


                <div className={cn(styles.bigCards, 'ktl-offset-top-l')}>
                    {primaryCardsData.map((card) => (
                        <Link className={styles.ecosystemCard} key={card.title} href={card.linkHref}>
                            <img src={card.src.src} alt={`${card.title} Logo`} />
                            <p className={textCn('rs-text-2')}>{card.text}</p>
                            <p className={textCn('rs-text-2')}>
                                <span className={textCn('rs-link', {
                                    external: true,
                                    mode: 'standalone'
                                })}>{card.linkText}</span>
                            </p>
                        </Link>
                    ))}
                </div>

                <div className={cn(styles.grid, 'ktl-offset-top-m')}>
                    {secondaryCardsData.map((card) => (
                        <div key={card.title}>
                            <Link className={styles.ecosystemCard} href={card.linkHref}>
                                <div className={styles.cardLogo}>
                                    {card.src?.src ? <img src={card.src.src} alt={`${card.title} Logo`} /> :
                                        <div className={textCn('rs-h3')}>{card.title}</div>}
                                </div>
                                <div className={textCn('rs-text-2')}>{card.text}</div>

                                {!card.src?.src &&
                                    <div className={styles.tag}>
                                        <Tag {...presets['classic-light']}>by JetBrains</Tag>
                                    </div>
                                }
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

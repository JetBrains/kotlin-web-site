import React, { FC } from 'react';

import cn from 'classnames';

import styles from './ecosystem.module.css';
import { useTextStyles } from '@rescui/typography';

import { Card } from '../card/card';

import { primaryCardsData, secondaryCardsData } from './ecosystem-data';

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
                        title={'Seamless Java Integration'}
                        description={'Full interop with Java allows using any JVM library or framework'}
                    />

                    <Card
                        title={'Enhanced Java Frameworks with Kotlin'}
                        description={'Kotlin takes frameworks that were originally written in Java and enhances them with expressive features, making the API clearer and more intuitive'}
                    />

                    <Card
                        title={'Gradual Kotlin Adoption'}
                        description={'100% interoperability between Java and Kotlin allows you to adopt Kotlin incrementally and on your own terms'}
                    />

                    <Card
                        title={'Robust web framework ecosystem'}
                        description={'Quickly develop powerful backend solutions with the most popular frameworks'}
                    />
                </div>


                <div className={cn(styles.bigCards, "ktl-offset-top-l")}>
                    {primaryCardsData.map((card) => (
                        <div className={styles.ecosystemCard} key={card.title}>
                            <img src={card.src.src} alt="" />
                            <p className={textCn('rs-text-2')}>{card.text}</p>
                            <p className={textCn('rs-text-2')}>
                                <a className={textCn('rs-link', {external:true, mode: 'standalone'})} href={card.linkHref}>{card.linkText}</a>
                            </p>
                        </div>
                    ))}
                </div>

                <div className={cn(styles.grid, 'ktl-offset-top-m')}>
                    {secondaryCardsData.map((card) => (
                        <div key={card.title}>
                            <div className={styles.ecosystemCard}>
                                <img src={card.src.src} alt="" />
                                <p className={textCn('rs-text-2')}>{card.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

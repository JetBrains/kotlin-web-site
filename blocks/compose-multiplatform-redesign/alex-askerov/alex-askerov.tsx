import React, { FC } from 'react';
import { useSnapCarousel } from 'react-snap-carousel';
import { useTextStyles } from '@rescui/typography';
import { Button } from '@rescui/button';
import { ArrowLeftIcon, ArrowRightIcon } from '@rescui/icons';

import { TESTIMONIALS } from './alex-askerov-data';

import styles from './alex-askerov.module.css';

export const AlexAskerovSection: FC = () => {
    const textCn = useTextStyles();
    const { scrollRef, activePageIndex, prev, next, pages } = useSnapCarousel();

    return (
        <section className={styles.wrapper} id="alex-askerov" data-testid="compose-multiplatform-redesign-alex-askerov">
            <ul
                className={styles.track}
                ref={scrollRef}
                data-testid="compose-multiplatform-redesign-alex-askerov-track"
            >
                {TESTIMONIALS.map((item) => (
                    <li key={item.id} className={styles.slide}>
                        <figure className={styles.card}>
                            <div className={styles.person}>
                                <img
                                    className={styles.photo}
                                    src={item.photo}
                                    alt={item.name}
                                    width={220}
                                    height={220}
                                />
                                <figcaption className={styles.caption}>
                                    <p className={textCn('rs-h3')}>{item.name}</p>
                                    <p className={textCn('rs-text-3', { hardness: 'pale' })}>{item.role}</p>
                                </figcaption>
                            </div>
                            <blockquote className={styles.quote}>
                                {item.paragraphs.map((text, index) => (
                                    <p key={index} className={textCn('rs-text-1')}>
                                        {text}
                                    </p>
                                ))}
                            </blockquote>
                        </figure>
                    </li>
                ))}
            </ul>
            <div className={styles.controls}>
                <Button
                    mode="outline"
                    icon={<ArrowLeftIcon />}
                    onClick={() => prev()}
                    aria-label="Previous testimonial"
                    data-testid="compose-multiplatform-redesign-alex-askerov-prev"
                />
                <p className={textCn('rs-text-2', { hardness: 'average' })} aria-live="polite">
                    {activePageIndex + 1}/{pages.length || TESTIMONIALS.length}
                </p>
                <Button
                    mode="outline"
                    icon={<ArrowRightIcon />}
                    onClick={() => next()}
                    aria-label="Next testimonial"
                    data-testid="compose-multiplatform-redesign-alex-askerov-next"
                />
            </div>
        </section>
    );
};

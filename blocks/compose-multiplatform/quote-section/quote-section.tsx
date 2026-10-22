import React from 'react';
import cn from 'classnames';
import { createTextCn } from '@rescui/typography';

import { SnapCarousel } from '../../../components/snap-carousel/snap-carousel';
import { quoteSectionData } from './quote-section-data';
import styles from './quote-section.module.css';

const textCn = createTextCn('dark');

const QuoteSection = () => (
    <section className={styles.wrapper} data-testid="quote-section" aria-label="Quotes">
        <div className="ktl-layout ktl-layout--center">
            <SnapCarousel navigationAlign="right" adaptiveHeight>
                {quoteSectionData.map(({ id, name, imageSrc, role, text }) => (
                    <article key={id} data-testid="quote-card" className={styles.card}>
                        <div className={cn(textCn('rs-text-1', { hardness: 'hard' }), styles.text)}>{text}</div>
                        <div className={styles.author}>
                            <img alt="" src={imageSrc} className={styles.image} />
                            <div>
                                <h3 className={cn(textCn('rs-h3'), styles.name)}>{name}</h3>
                                <p className={cn(textCn('rs-text-3', { hardness: 'pale' }), styles.role)}>{role}</p>
                            </div>
                        </div>
                    </article>
                ))}
            </SnapCarousel>
        </div>
    </section>
);

export default QuoteSection;

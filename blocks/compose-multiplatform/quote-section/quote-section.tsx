import React from 'react';
import cn from 'classnames';
import { cardCn } from '@rescui/card';
import { createTextCn } from '@rescui/typography';

import { quoteSectionData } from './quote-section-data';
import styles from './quote-section.module.css';
import { useTS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

const QuoteSection = () => {
    const textCn = createTextCn('dark');
    const isTS = useTS();

    return (
        <section className={styles.wrapper}>
            <div className="ktl-layout ktl-layout--center">
                <div className={styles.container}>
                    {quoteSectionData.map(({ id, name, imageSrc, role, text }) => (
                        <article
                            key={id}
                            className={cn(
                                cardCn({
                                    borderRadius: 24,
                                    paddings: 32,
                                    theme: 'dark',
                                }),
                                styles.card
                            )}
                        >
                            <div className={styles.cardHeader}>
                                <img alt="" src={imageSrc} className={styles.image} />
                                <div className={styles.cardHeaderText}>
                                    <h4 className={cn(textCn(isTS ? 'rs-h4' : 'rs-h3'), styles.name)}>{name}</h4>
                                    <p className={cn(textCn('rs-text-3', { hardness: 'pale' }), styles.role)}>{role}</p>
                                </div>
                            </div>
                            <div className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.text)}>{text}</div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuoteSection;

import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { Button } from '@rescui/button';
import { useML } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

import { BUILD_YOUR_FIRST_COPY, BUILD_YOUR_FIRST_HREF } from './build-your-first-data';

import styles from './build-your-first.module.css';

export const BuildYourFirstSection: FC = () => {
    const textCn = useTextStyles();
    const isML = useML();
    const [title, lead, cta] = BUILD_YOUR_FIRST_COPY;

    return (
        <section
            className={styles.wrapper}
            id="build-your-first"
            data-testid="compose-multiplatform-redesign-build-your-first"
        >
            <div className={styles.decor} aria-hidden>
                <img
                    src="/images/compose-multiplatform-redesign/decor-footer-graphic.png"
                    alt=""
                    aria-hidden
                    className={styles['footer-img']}
                />
            </div>
            <div className={styles.content}>
                <div className={styles.texts}>
                    <h2
                        className={cn(styles.title, textCn('rs-h1'))}
                        data-testid="compose-multiplatform-redesign-build-your-first-title"
                    >
                        {title.text}
                    </h2>
                    <p className={cn(styles.lead, textCn('rs-text-1'))}>{lead.text}</p>
                </div>
                <Button
                    href={BUILD_YOUR_FIRST_HREF}
                    mode="rock"
                    size={isML ? 'm' : 'l'}
                    className={styles.button}
                    data-testid="compose-multiplatform-redesign-build-your-first-cta"
                >
                    {cta.text}
                </Button>
            </div>
        </section>
    );
};

import React, { FC } from 'react';
import cn from 'classnames';
import Img from 'next/image';
import { useTextStyles } from '@rescui/typography';
import { Button } from '@rescui/button';

import { TRY_COMPOSE_MULTIPLATFORM_COPY } from './try-compose-multiplatform-data';
import showcaseImage from './images/showcase.png';
import codeIcon from './images/code-outline.svg';
import externalIcon from './images/external-outline.svg';
import playIcon from './images/play.svg';

import styles from './try-compose-multiplatform.module.css';

const [TITLE, RUN] = TRY_COMPOSE_MULTIPLATFORM_COPY;

export const TryComposeMultiplatformSection: FC = () => {
    const textCn = useTextStyles();

    return (
        <section
            className={styles.wrapper}
            id="try-compose-multiplatform"
            data-testid="compose-multiplatform-redesign-try-compose-multiplatform"
        >
            <div className={styles.head}>
                <h2
                    className={cn(textCn('rs-h1'), styles.title)}
                    data-testid="compose-multiplatform-redesign-try-compose-multiplatform-title"
                >
                    {TITLE.text}
                </h2>
                <div className={styles.actions}>
                    <Button
                        mode="outline"
                        size="m"
                        type="button"
                        aria-label="View code"
                        icon={<Img src={codeIcon} alt="" width={24} height={24} />}
                    />
                    <Button
                        mode="outline"
                        size="m"
                        type="button"
                        aria-label="Open in a new window"
                        icon={<Img src={externalIcon} alt="" width={24} height={24} />}
                    />
                    <Button
                        mode="classic"
                        size="m"
                        type="button"
                        icon={<Img src={playIcon} alt="" width={24} height={24} />}
                        data-testid="compose-multiplatform-redesign-try-compose-multiplatform-run"
                    >
                        {RUN.text}
                    </Button>
                </div>
            </div>
            <div className={styles.card}>
                <Img src={showcaseImage} alt="" className={styles.image} />
            </div>
        </section>
    );
};

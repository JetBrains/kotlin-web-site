import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { Tag } from '@rescui/tag';

import { SUPPORTED_PLATFORMS, SUPPORTED_PLATFORMS_TITLE } from './supported-platforms-data';

import styles from './supported-platforms.module.css';

export const SupportedPlatformsSection: FC = () => {
    const textCn = useTextStyles();

    return (
        <section
            className={styles.wrapper}
            id="supported-platforms"
            data-testid="compose-multiplatform-redesign-supported-platforms"
            data-section="04-format-cards"
        >
            <h2
                className={cn(styles.title, textCn('rs-h1'))}
                data-testid="compose-multiplatform-redesign-supported-platforms-title"
            >
                {SUPPORTED_PLATFORMS_TITLE}
            </h2>
            <div className={styles.grid}>
                {SUPPORTED_PLATFORMS.map((item) => (
                    <div
                        key={item.id}
                        className={styles.card}
                        data-testid={`compose-multiplatform-redesign-supported-platforms-${item.id}`}
                    >
                        <div className={styles.head}>
                            <img className={styles.icon} src={item.icon} alt="" width={48} height={48} />
                            <h3 className={cn(styles.name, textCn('rs-h3'))}>{item.title}</h3>
                            <Tag
                                size="s"
                                color={item.isBeta ? 'rgba(255, 255, 255, 0.7)' : '#ffffff'}
                                backgroundColor={item.isBeta ? 'rgba(255, 255, 255, 0.1)' : '#7e42ff'}
                            >
                                {item.tag}
                            </Tag>
                        </div>
                        <p className={cn(styles.text, textCn('rs-text-2'))}>{item.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

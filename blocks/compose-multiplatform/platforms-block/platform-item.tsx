import React, { FC } from 'react';
import cn from 'classnames';
import { createTextCn } from '@rescui/typography';
import { presets, Tag } from '@rescui/tag';
import { PlatformData } from './platforms-data';
import styles from './platform-icon.module.css';

type PlatformItemProps = PlatformData;

export const PlatformItem: FC<PlatformItemProps> = ({ icon, title, titleLink, text, tagText }) => {
    const textCnLight = createTextCn('dark');

    return (
        <li className={styles.item}>
            <div className={cn(styles.icon, styles[`${icon}`])} />
            <div>
                {titleLink ? (
                    <div
                        className={textCnLight('rs-text-1', { hardness: 'hard' })}
                    >
                        <a
                            href={titleLink}
                            className={textCnLight('rs-link', {
                                mode: 'classic',
                                external: true
                            })}
                            target="_blank"
                        >
                            {title}
                        </a>
                    </div>
                ) : (
                    <p className={textCnLight('rs-text-1', { hardness: 'hard' })}>
                        {title}
                    </p>
                )}
                {text && (
                    <p className={textCnLight('rs-text-2')}>
                        {text}
                    </p>
                )}
                {tagText && (
                    <Tag{...presets['filled-dark']} className={styles.tag}>
                        {tagText}
                    </Tag>
                )}
            </div>
        </li>
    );
};

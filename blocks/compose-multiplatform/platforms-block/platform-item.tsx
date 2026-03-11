import React, { FC } from 'react';
import cn from 'classnames';
import { createTextCn } from '@rescui/typography';
import { presets, Tag } from '@rescui/tag';
import Link from 'next/link';
import { PlatformData } from './platforms-data';
import styles from './platform-icon.module.css';

type PlatformItemProps = PlatformData;

export const PlatformItem: FC<PlatformItemProps> = ({ icon, title, titleLink, text, tagText }) => {
    const textCnLight = createTextCn('dark');

    return (
        <li className={styles.item} data-testid="platforms-block-item">
            <div className={cn(styles.icon, styles[`${icon}`])} />
            <div>
                {titleLink ? (
                    <div
                        className={textCnLight('rs-text-1', { hardness: 'hard' })}
                    >
                        <Link
                            href={titleLink}
                            className={cn(textCnLight('rs-link', {
                                mode: 'classic',
                                external: true
                            }), styles.title)}
                            target="_blank"
                        >
                            {title}
                        </Link>
                    </div>
                ) : (
                    <p className={cn(textCnLight('rs-text-1', { hardness: 'hard' }), styles.title)}>
                        {title}
                    </p>
                )}
                {text && (
                    <p className={cn(textCnLight('rs-text-2'), styles.text)}>
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

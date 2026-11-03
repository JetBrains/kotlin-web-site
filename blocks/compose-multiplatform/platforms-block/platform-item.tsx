import React, { FC } from 'react';
import cn from 'classnames';
import Img, { StaticImageData } from 'next/image';
import { createTextCn } from '@rescui/typography';
import { presets, Tag } from '@rescui/tag';
import { PlatformData, PlatformId } from './platforms-data';
import styles from './platforms-block.module.css';

import androidIcon from './images/android.svg';
import appleIcon from './images/apple.svg';
import computerIcon from './images/computer.svg';
import globusIcon from './images/globus.svg';

const PLATFORM_ICONS: Record<PlatformId, StaticImageData> = {
    android: androidIcon,
    ios: appleIcon,
    desktop: computerIcon,
    web: globusIcon
};

type PlatformItemProps = PlatformData;

export const PlatformItem: FC<PlatformItemProps> = ({ id, title, text, isBeta }) => {
    const textCn = createTextCn('dark');

    return (
        <li className={styles.card} data-testid="platforms-block-item">
            <div className={styles.cardHeader}>
                <Img src={PLATFORM_ICONS[id]} alt="" className={styles.icon} />
                <h3 className={cn(textCn('rs-h2'), styles.cardTitle)}>{title}</h3>
                {isBeta && <Tag size="s" {...presets['filled-dark']}>Beta</Tag>}
            </div>
            <p className={cn(textCn('rs-text-2'), styles.cardText)}>{text}</p>
        </li>
    );
};

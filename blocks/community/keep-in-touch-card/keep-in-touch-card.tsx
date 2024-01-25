import React, { FC } from 'react';
import classNames from 'classnames';
import { cardCn } from '@rescui/card';
import styles from './keep-in-touch-card.module.css';
import { useTextStyles } from '@rescui/typography';

export interface KeepInTouchCardProps {
    icon: ImgSrc;
    title: string;
    description: string;
    link: string;
}

export const KeepInTouchCard: FC<KeepInTouchCardProps> = ({ icon, title, description, link }) => {
    const cardClassName = classNames(cardCn({ paddings: 16, isClickable: true }), styles.card);
    const textCn = useTextStyles();

    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className={cardClassName}>
            <div className={styles.wrapper}>
                <div className={classNames(styles.icon)}>
                    <img src={icon.src} alt={title} />
                </div>
                <div className={classNames(styles.bottom)}>
                    <div className={classNames(styles.title, 'ktl-h4')}>{title}</div>
                    <div className={'ktl-offset-top-xs'}>
                        <div className={classNames(styles.description, 'ktl-dimmed-text', textCn('rs-text-1'))}>
                            {description}
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
};

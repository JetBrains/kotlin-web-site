import React, { FC } from 'react';
import cn from 'classnames';
import { createTextCn } from '@rescui/typography';

import styles from './developer.module.css';

import JBLogo from '../../../../../assets/jetbrains-logo.svg';

export const Developer: FC = () => {
    const darkTextCn = createTextCn('dark');

    return (
        <div className={styles.developer}>
            <div className={styles.developerContent}>
                <div
                    className={cn(darkTextCn('rs-text-2', { hardness: 'hard' }), styles.developerCaption)}>Developed
                    by
                </div>
                <a
                    href="https://www.jetbrains.com/"
                    target={'_blank'}
                    rel={'noreferrer noopener'}
                >
                    <img src={JBLogo.src} alt="jetbrains logo"
                         className={styles.developerLogo} />{' '}
                </a>
            </div>
        </div>
    );
};

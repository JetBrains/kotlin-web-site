import React, { FC } from 'react';
import cn from 'classnames';

import Link from 'next/link';

import Mascot404 from './404-mascot.svg';

import { useTextStyles } from '@rescui/typography';

import styles from './404.module.css';

export const NotFoundContent: FC = () => {
    const textCn = useTextStyles();

    return (
        <div className={styles.wrapper}>
            <img className={styles.image} src={Mascot404.src} alt="404"/>
            <h1 className={cn(textCn('rs-h1'), styles.heading)}>Page not found</h1>
            <p className={cn(textCn('rs-text-2', { hardness: 'hard' }), styles.subheading)}>
                Please use search or try<br className={styles.lineBreak} /> starting from{' '}
                <Link className={textCn('rs-link', { hardness: 'hard', mode: 'classic' })} href="/">
                    home.
                </Link>
            </p>
        </div>
    );
};

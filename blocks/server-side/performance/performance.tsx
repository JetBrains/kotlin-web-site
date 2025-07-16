import React, { FC } from 'react';

import cn from 'classnames';

import styles from './performance.module.css';
import { useTextStyles } from '@rescui/typography';


export const ServerSidePerformance: FC = ({}) => {

    const textCn = useTextStyles();

    return (
        <div className={styles.wrapper}>
            <h2>performance</h2>
        </div>
    );
};

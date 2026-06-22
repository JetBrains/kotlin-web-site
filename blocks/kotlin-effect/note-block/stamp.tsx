import React from 'react';
import styles from './stamp.module.css';

import Kodee from './kodee.webp';

export const Stamp = () => (
    <div className={styles.stamp}>
        <div className={styles.kodeeContainer}>
            <img src={Kodee.src} className={styles.kodee} alt="Kodee" />
        </div>
    </div>
);

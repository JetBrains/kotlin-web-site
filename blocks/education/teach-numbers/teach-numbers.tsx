import React, { FC } from 'react';
import styles from './teach-numbers.module.css';

interface TeachNumbersProps {
    countriesCount: number;
    universitiesCount: number;
}

export const TeachNumbers: FC<TeachNumbersProps> = ({ countriesCount, universitiesCount }) => {
    return (
        <div className={styles.numbers}>
            <div className={styles.number}>
                <div className={styles.title}>
                    <div className="ktl-hero">{countriesCount}</div>
                </div>
                <div className={styles.subtitle}>
                    <div className="ktl-text-2">countries</div>
                </div>
            </div>
            <div className={styles.number}>
                <div className={styles.title}>
                    <div className="ktl-hero">{universitiesCount}</div>
                </div>
                <div className={styles.subtitle}>
                    <div className="ktl-text-2">universities</div>
                </div>
            </div>
        </div>
    );
};

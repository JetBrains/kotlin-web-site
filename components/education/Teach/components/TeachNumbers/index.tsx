import React from 'react';
import styles from './styles.module.scss';

interface TeachNumbersProps {
  countriesCount: number;
  universitiesCount: number;
}

export function TeachNumbers({ countriesCount, universitiesCount }: TeachNumbersProps) {
  return (
    <div className={styles.numbers}>
      <div className={styles.number}>
        <div className={styles.title}>
          <div className="ktl-hero">
            {countriesCount}
          </div>
        </div>
        <div className={styles.subtitle}>
          <div className="ktl-text-2">
            countries
          </div>
        </div>
      </div>
      <div className={styles.number}>
        <div className={styles.title}>
          <div className="ktl-hero">
            {universitiesCount}
          </div>
        </div>
        <div className={styles.subtitle}>
          <div className="ktl-text-2">
            universities
          </div>
        </div>
      </div>
    </div>
  );
}
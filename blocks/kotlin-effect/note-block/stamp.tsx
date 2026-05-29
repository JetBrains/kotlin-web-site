import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import styles from './stamp.module.css';

import KodeeBg from '@/pages/kotlin-effect/kodee-bg.svg';
import KodeePng from '@/pages/kotlin-effect/kodee.png';

type KodeeState = 'hidden' | 'entering' | 'settled';

export const Stamp = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<KodeeState>('hidden');

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setState('entering');
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={styles.stamp}>
            <img src={KodeeBg.src} className={styles.bg} alt="" aria-hidden="true" />
            <img
                src={KodeePng.src}
                className={cn(styles.kodee, {
                    [styles.kodeeEntering]: state === 'entering',
                    [styles.kodeeSettled]: state === 'settled',
                })}
                alt="Kodee"
                onAnimationEnd={state === 'entering' ? () => setState('settled') : undefined}
            />
            <div className={styles.frame} aria-hidden="true" />
        </div>
    );
};

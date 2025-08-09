import React, { ReactNode, useRef, useState } from 'react';
import styles from './index.module.css';

interface MarqueeProps {
    children: ReactNode;
    className?: string;
    pauseOnHover?: boolean;
    hasFadingEdges?: boolean;
}

export const Marquee: React.FC<MarqueeProps> = ({
    children,
    className = '',
    pauseOnHover = false,
    hasFadingEdges = true,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    const handleMouseEnter = () => {
        if (pauseOnHover) {
            setIsPaused(true);
        }
    };

    const handleMouseLeave = () => {
        if (pauseOnHover) {
            setIsPaused(false);
        }
    };

    return (
        <div
            className={`${styles.marquee} ${hasFadingEdges ? styles.fadingEdges : ''} ${className}`}
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`${styles.group} ${isPaused ? styles.paused : ''}`}>{children}</div>
            <div className={`${styles.group} ${styles.duplicate} ${isPaused ? styles.paused : ''}`}>{children}</div>
        </div>
    );
};

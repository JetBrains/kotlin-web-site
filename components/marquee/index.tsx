import React, { CSSProperties, ReactNode, useRef, useState } from 'react';
import styles from './index.module.css';

interface MarqueeProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    pauseOnHover?: boolean;
    hasFadingEdges?: boolean;
    /**
     * Hide the duplicated track from assistive tech, so its contents are announced once.
     * Opt-in: `aria-hidden` on a container of focusable children is an aria-hidden-focus
     * violation, so only pass this when the children carry nothing tabbable.
     */
    hideDuplicateFromA11y?: boolean;
}

export const Marquee: React.FC<MarqueeProps> = ({
    children,
    className = '',
    style,
    pauseOnHover = false,
    hasFadingEdges = true,
    hideDuplicateFromA11y = false,
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
            style={style}
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`${styles.group} ${isPaused ? styles.paused : ''}`} data-testid={'marquee-component'}>{children}</div>
            <div
                className={`${styles.group} ${styles.duplicate} ${isPaused ? styles.paused : ''}`}
                data-testid={'marquee-duplicate'}
                aria-hidden={hideDuplicateFromA11y || undefined}
            >
                {children}
            </div>
        </div>
    );
};

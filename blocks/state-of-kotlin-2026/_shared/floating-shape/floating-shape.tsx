import React, { CSSProperties, FC } from 'react';
import cn from 'classnames';

import { Shape } from './shapes';
import { ParallaxAnchor, useParallax } from './use-parallax';

import styles from './floating-shape.module.css';


export type Drift = 'a' | 'b' | 'c' | 'd';

const DRIFTS: Record<Drift, string> = {
    a: styles.driftA,
    b: styles.driftB,
    c: styles.driftC,
    d: styles.driftD,
};

type FloatingShapeProps = {
    shape: Shape;
    /** Where the shape sits. Owned by the block that hosts it — see that section's CSS module. */
    className: string;
    /**
     * How far, in px, the shape lags the page over one viewport of scrolling. Larger reads as
     * further away.
     */
    depth: number;
    drift: Drift;
    anchor?: ParallaxAnchor;
    /** Set on the shapes that are already on screen when the page loads. */
    eager?: boolean;
};

export const FloatingShape: FC<FloatingShapeProps> = ({
    shape,
    className,
    depth,
    drift,
    anchor = 'self',
    eager = false,
}) => {
    const ref = useParallax<HTMLSpanElement>(depth, anchor);

    const box = {
        '--sok-shape-width': `${shape.width}px`,
        '--sok-shape-ratio': `${shape.width} / ${shape.height}`,
    } as CSSProperties;

    return (
        <span ref={ref} className={cn(styles.shape, className)} style={box} aria-hidden="true">
            {shape.src ? (
                <img
                    src={shape.src}
                    alt=""
                    width={shape.width}
                    height={shape.height}
                    className={cn(styles.image, DRIFTS[drift])}
                    loading={eager ? 'eager' : 'lazy'}
                />
            ) : (
                <span className={cn(styles.image, DRIFTS[drift])} />
            )}
        </span>
    );
};

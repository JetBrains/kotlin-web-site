import React, { FC } from 'react';

import { FloatingShape } from '@/blocks/state-of-kotlin-2026/_shared/floating-shape/floating-shape';
import { SHAPES } from '@/blocks/state-of-kotlin-2026/_shared/floating-shape/shapes';

import styles from './hero-decoration.module.css';

/**
 * The four layers behind the hero: a blurred gradient and the three renders that float over it.
 *
 * The design keeps them in one group whose left, right and top edges all run outside the
 * artboard, so only a part of each shape shows (KTL-4799). `.decoration` reproduces that crop,
 * which lets every layer be placed by its full box instead of being nudged inwards to fit.
 */
export const HeroDecoration: FC = () => (
    <div className={styles.decoration}>
        <FloatingShape shape={SHAPES.heroGradient} className={styles.gradient} depth={60} drift="d" anchor="page" eager />
        <FloatingShape shape={SHAPES.heroTriangle} className={styles.triangle} depth={130} drift="a" anchor="page" eager />
        <FloatingShape
            shape={SHAPES.heroHollowCylinder}
            className={styles.hollowCylinder}
            depth={170}
            drift="b"
            anchor="page"
            eager
        />
        <FloatingShape shape={SHAPES.heroCylinder} className={styles.cylinder} depth={90} drift="c" anchor="page" eager />
    </div>
);

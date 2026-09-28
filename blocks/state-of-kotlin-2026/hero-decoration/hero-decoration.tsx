import React, { FC } from 'react';

import { FloatingShape } from '@/blocks/state-of-kotlin-2026/shared/floating-shape/floating-shape';
import { SHAPES } from '@/blocks/state-of-kotlin-2026/shared/floating-shape/shapes';

import styles from './hero-decoration.module.css';

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

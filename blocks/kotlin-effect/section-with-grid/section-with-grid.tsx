import Image from 'next/image';
import { ReactNode } from 'react';

import gridImg from './images/grid.png';

import styles from './section-with-grid.module.css';
import cn from 'classnames';

interface SectionWithGridProps {
    children: ReactNode;
    wide?: boolean;
    id?: string;
    priority?: boolean;
    className?: string;
}

export function SectionWithGrid({ children, priority = false, className, id, wide }: SectionWithGridProps) {
    return (
        <div id={id} className={cn(styles.section, className)}>
            <div className={cn(styles.cover, wide && styles.wideCover)}>
                <Image
                    src={gridImg.src}
                    alt=""
                    fill
                    style={{
                        objectFit: 'cover',
                    }}
                    quality={75}
                    priority={priority}
                />
            </div>
            <div className={cn(styles.gradientCover, wide && styles.wideGradientCover)} />
            <div className={styles.sectionChild}>{children}</div>
        </div>
    );
}

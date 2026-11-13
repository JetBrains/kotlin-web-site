import React, { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { cardCn } from '@rescui/card';
import { CheckIcon } from '@rescui/icons';
import { useTextStyles } from '@rescui/typography';

import cubeGraphics from '@/public/images/state-of-kotlin-2026/deco-cube.webp';
import sphereGraphics from '@/public/images/state-of-kotlin-2026/deco-sphere.webp';
import { PUBLIC_SUPPORT_URL, SECTION_IDS } from '../constants';
import { SUPPORT_OPTIONS } from './benefits-data';
import { useCardEntrance } from '../use-card-entrance';

import shared from '../kotlin-lts.module.css';
import styles from './benefits.module.css';

const SUPPORT_GRAPHICS = {
    public: cubeGraphics,
    commercial: sphereGraphics,
};

export const Benefits: FC = () => {
    const textCn = useTextStyles();
    const gridRef = useCardEntrance<HTMLDivElement>();

    return (
        <section
            id={SECTION_IDS.benefits}
            aria-labelledby="lts-benefits-title"
            className={cn(shared.section, shared.light)}
            data-testid="lts-benefits"
        >
            <div className="ktl-layout ktl-layout--center">
                <h2 id="lts-benefits-title" className={cn(textCn('rs-h1'), shared.title)}>
                    Understand what paid support adds
                </h2>
                <p className={cn(textCn('rs-text-1', { hardness: 'average' }), shared.lead)}>
                    Start with the public update path, then assess any additional support your team needs.
                </p>
                <div ref={gridRef} className={styles.grid}>
                    {SUPPORT_OPTIONS.map(({ id, title, points }) => (
                        <article
                            key={id}
                            aria-labelledby={`lts-support-${id}-title`}
                            className={cn(cardCn({ paddings: 32, borderRadius: 16 }), styles.card, {
                                [styles.commercial]: id === 'commercial',
                            })}
                        >
                            <div className={styles.cardHeader}>
                                <h3 id={`lts-support-${id}-title`} className={cn(textCn('rs-h2'), styles.cardTitle)}>
                                    {title}
                                </h3>
                                <Image
                                    src={SUPPORT_GRAPHICS[id]}
                                    alt=""
                                    aria-hidden="true"
                                    sizes="(max-width: 1190px) 180px, 220px"
                                    className={styles.artwork}
                                />
                            </div>
                            <div className={styles.cardBody}>
                                <ul className={styles.points}>
                                    {points.map((point) => (
                                        <li key={point} className={cn(textCn('rs-text-2'), styles.point)}>
                                            <CheckIcon size="s" className={styles.icon} aria-hidden="true" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                                {id === 'public' && (
                                    <p className={cn(textCn('rs-text-2'), styles.policyLink)}>
                                        <a href={PUBLIC_SUPPORT_URL} className={textCn('rs-link')}>
                                            Read the public support policy
                                        </a>
                                    </p>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

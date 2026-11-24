import React, { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import cubeGraphics from '@/public/images/state-of-kotlin-2026/deco-cube.webp';
import sphereGraphics from '@/public/images/state-of-kotlin-2026/deco-sphere.webp';

import { PUBLIC_SUPPORT_URL, SECTION_IDS } from '../constants';
import { SUPPORT_COMPARISON } from './benefits-data';
import shared from '../kotlin-lts.module.css';
import styles from './benefits.module.css';

export const Benefits: FC = () => {
    const textCn = useTextStyles();

    return (
        <section
            id={SECTION_IDS.benefits}
            aria-labelledby="lts-benefits-title"
            className={cn(shared.section, shared.soft)}
            data-testid="lts-benefits"
        >
            <div className="ktl-layout ktl-layout--center">
                <h2 id="lts-benefits-title" className={cn(textCn('rs-h1'), shared.title)}>
                    Compare support options
                </h2>
                <div className={styles.tableScroll}>
                    <table role="table" className={cn(textCn('rs-text-2'), styles.table)} aria-labelledby="lts-benefits-title">
                        <colgroup>
                            <col className={styles.criteria} />
                            <col />
                            <col />
                        </colgroup>
                        <thead role="rowgroup">
                            <tr role="row">
                                <td role="cell" className={styles.emptyCorner} />
                                <th role="columnheader" scope="col" className={styles.publicHeader}>
                                    <Image src={cubeGraphics} alt="" sizes="156px" className={styles.artwork} />
                                    <span className={cn(textCn('rs-h3'), styles.headerTitle)}>Public support (free)</span>
                                </th>
                                <th role="columnheader" scope="col" className={styles.paidHeader}>
                                    <Image src={sphereGraphics} alt="" sizes="156px" className={styles.artwork} />
                                    <span className={cn(textCn('rs-h3'), styles.headerTitle)}>Paid Kotlin LTS</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody role="rowgroup">
                            {SUPPORT_COMPARISON.map(([criterion, publicSupport, paidSupport]) => (
                                <tr role="row" key={criterion}>
                                    <th role="rowheader" scope="row">{criterion}</th>
                                    <td role="cell">
                                        <span className={styles.mobileLabel} aria-hidden="true">Public support (free)</span>
                                        {publicSupport}
                                        {criterion === 'Versions' && (
                                            <a
                                                href={PUBLIC_SUPPORT_URL}
                                                className={cn(textCn('rs-link'), styles.policyLink)}
                                            >
                                                Public support policy <span aria-hidden="true">↗</span>
                                            </a>
                                        )}
                                    </td>
                                    <td role="cell">
                                        <span className={styles.mobileLabel} aria-hidden="true">Paid Kotlin LTS</span>
                                        {paidSupport}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

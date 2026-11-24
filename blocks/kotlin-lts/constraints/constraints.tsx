import React, { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import sphereGraphics from '@/public/images/state-of-kotlin-2026/deco-sphere.webp';
import { CONTACT_TEAM_URL } from '../constants';
import shared from '../kotlin-lts.module.css';
import styles from './constraints.module.css';

export const Constraints: FC = () => {
    const textCn = useTextStyles();

    return (
        <section
            className={cn(shared.section, shared.light, styles.section)}
            aria-labelledby="lts-constraints-title"
            data-testid="lts-constraints"
        >
            <div className={cn('ktl-layout', 'ktl-layout--center', styles.layout)}>
                <div>
                    <h2 id="lts-constraints-title" className={cn(textCn('rs-h1'), shared.title)}>
                        When Kotlin&nbsp;LTS can help
                    </h2>
                    <p className={cn(textCn('rs-text-1', { hardness: 'average' }), shared.lead, styles.description)}>
                        When you need security fixes but want to stay on your current Kotlin stack because upgrading would
                        require additional development, testing, or migration effort.
                    </p>
                    <p className={cn(textCn('rs-text-2'), styles.contact)}>
                        <a className={textCn('rs-link')} href={CONTACT_TEAM_URL}>Get a free assessment of your stack</a>
                    </p>
                </div>
                <div className={styles.comparison}>
                    <ol className={cn(textCn('rs-text-3'), styles.timeline)} aria-label="Kotlin versions">
                        <li>2.3 and earlier</li>
                        <li aria-label="Kotlin 2.4, start of free public support"><strong>Kotlin 2.4</strong></li>
                        <li>Later versions</li>
                    </ol>
                    <h3 className={cn(textCn('rs-text-1'), styles.label)}>Free public support</h3>
                    <p className={cn(textCn('rs-text-2'), styles.publicSupport)}>
                        <strong>Standard library for JVM</strong>
                        <span>
                            18 months window
                            <span className={styles.mobileStart}>, starting with Kotlin 2.4</span>
                        </span>
                    </p>
                    <h3 className={cn(textCn('rs-text-1'), styles.label, styles.paidLabel)}>Paid Kotlin LTS</h3>
                    <div className={styles.paidSupport}>
                        <p className={cn(textCn('rs-text-2'), styles.paidCopy)}>
                            Get backported security fixes for the Kotlin components and versions you choose.
                        </p>
                        <Image src={sphereGraphics} alt="" sizes="112px" className={styles.sphere} />
                    </div>
                </div>
            </div>
        </section>
    );
};

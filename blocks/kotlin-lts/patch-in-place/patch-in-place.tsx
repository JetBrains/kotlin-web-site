import React, { FC } from 'react';
import cn from 'classnames';
import { CheckIcon } from '@rescui/icons';
import { useTextStyles } from '@rescui/typography';

import { CodeHighlight } from '@/components/code-highlight/code-highlight';
import { SECTION_IDS } from '../constants';
import shared from '../kotlin-lts.module.css';
import styles from './patch-in-place.module.css';

const CHECKLIST = [
    'Minimal, targeted changes on top of your current version',
    'Drop-in artifacts from a subscriber-only repository',
    'Direct notifications when a security fix is available',
];

const CODE_SAMPLE = `// settings.gradle.kts
dependencyResolutionManagement {
    repositories {
        maven("https://lts.example.com/maven") {
            credentials {
                username = providers.gradleProperty("ltsUser").get()
                password = providers.gradleProperty("ltsToken").get()
            }
        }
        mavenCentral()
    }
}

// build.gradle.kts
plugins {
    kotlin("jvm") version "2.x.y-lts.N"
}`;

export const PatchInPlace: FC = () => {
    const textCn = useTextStyles();

    return (
        <section
            id={SECTION_IDS.how}
            aria-labelledby="lts-how-title"
            className={cn(shared.section, shared.light)}
            data-testid="lts-how"
        >
            <div className={cn('ktl-layout', 'ktl-layout--center', styles.split)}>
                <div>
                    <h2 id="lts-how-title" className={cn(textCn('rs-h1'), shared.title)} data-testid="lts-how-title">
                        Targeted Patches in Your Workflow
                    </h2>
                    <p className={cn(textCn('rs-subtitle-2', { hardness: 'average' }), shared.lead)}>
                        Point your build at the subscriber repository and pick up maintenance releases of the version
                        you already run, with no migration project required.
                    </p>

                    <ul className={styles.checklist}>
                        {CHECKLIST.map((item) => (
                            <li key={item} className={cn(textCn('rs-text-1'), styles.checkItem)}>
                                <span className={styles.checkIcon} aria-hidden="true">
                                    <CheckIcon size="s" />
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.code} data-testid="lts-how-code">
                    <CodeHighlight code={CODE_SAMPLE} className={styles.codeBlock} />
                </div>
            </div>
        </section>
    );
};

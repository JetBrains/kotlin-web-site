/**
 * {{sectionKey}} — {{figmaName}} (node {{nodeId}}), {{width}}×{{height}} at 1540.
 * Bucket {{bucket}}; crop {{pageRecord}}/{{crop}}.
{{annotationsBlock}} * Scaffold from emit-project-page.mjs — the inside of the section is the markup step's.
 */
import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import { {{copyConst}} } from './{{slug}}-data';

import styles from './{{slug}}.module.css';

export const {{sectionComponent}}: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.wrapper} id="{{slug}}" data-testid="{{testId}}" data-section="{{sectionKey}}">
            {{{copyConst}}.map((item) => (
                <p key={item.id} className={cn(styles.text, textCn('rs-text-1'))}>
                    {item.text}
                </p>
            ))}
        </section>
    );
};

import React, { FC } from 'react';
import { Button } from '@rescui/button';
import cn from 'classnames';
import { ArrowRightIcon } from '@rescui/icons';

import { createTextCn } from '@rescui/typography';

import styles from './hero-ab-2.module.css';

import { HeroLayout } from '../components/layout/layout';
import { Developer } from '../components/developer/developer';
import { Playground } from '../components/playground/playground';

interface Props {
}

export const HeroSectionAB2: FC<Props> = ({}) => {
    const darkTextCn = createTextCn('dark');

    return (
        <HeroLayout>

            <div className={styles.grid}>

            </div>

            <h1 className={cn(darkTextCn('rs-super-hero'), styles.heroText)}>Kotlin</h1>
            <p className={cn(darkTextCn('rs-subtitle-1'), styles.subtitle)}>Concise. Multiplatform.
                Fun.</p>

            <Developer />
            <Playground />

        </HeroLayout>
    );
};

import cn from 'classnames';
import { createTextCn } from '@rescui/typography';

import styles from './report-block.module.css';
import { Button } from '@rescui/button';

export const ReportBlock = () => {
    const darkTextCn = createTextCn('dark');

    return (
        <div className={styles.reportBlock}>
            <div className={styles.inner}>
                <h2 className={cn(darkTextCn('rs-h1'), styles.title)}>The State of Kotlin Report 2025</h2>
                <div className={cn(darkTextCn('rs-text-1', { hardness: 'hard' }), styles.text)}>
                    The Kotlin Effect didn’t happen overnight. Over the past 15 years, Kotlin has grown into a language
                    and
                    platform trusted by millions of developers worldwide.
                </div>
                <div className={cn(darkTextCn('rs-text-2', { hardness: 'average' }), styles.text)}>
                    The State of Kotlin Report brings together data from across the ecosystem to show how Kotlin is
                    evolving
                    – from adoption trends and real-world usage to emerging areas like AI.
                </div>
                <Button
                    size="l"
                    mode="rock"
                    href={'https://kotlinfoundation.org/annual-report-2025/'}
                    className={styles.button}
                >
                    Read the Report
                </Button>
            </div>

        </div>
    );
};

import { Fragment, useState } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { Chip, ChipList } from '@rescui/chip-list';

import { CodeShareCard } from './card';

import styles from './choose-share-what.module.css';

import { useTabScroll } from '../../hooks/useTabScroll';

const TABS_BLOCKS = [
    {
        id: 'both-logic-ui',
        Tab: () => <>Both logic and UI</>,
        actionLink: '/docs/multiplatform/compose-multiplatform-create-first-app.html',
        Title: () => <>Maximum reuse, faster delivery.</>,
        Content: () => {
            const textCn = useTextStyles();
            return <>
                Use Kotlin with <a className={textCn('rs-link')}
                                   href="/compose-multiplatform/">Compose Multiplatform</a> to
                share up to 100% of your app code&nbsp;– including UI&nbsp;– while still integrating with native APIs.
                Reduce dev time, ensure consistent behavior, and ship on Android, iOS, desktop, and web from a single
                codebase.
            </>
        }
    },
    {
        id: 'logic-native-ui',
        Tab: () => <>Logic with native&nbsp;UI</>,
        actionLink: '/docs/multiplatform/multiplatform-create-first-app.html',
        Title: () => <>One logic layer, native experience.</>,
        Content: () => (
            <>
                Write your app's data handling and business logic once with Kotlin Multiplatform while keeping the UI
                fully native&nbsp;– perfect when UX precision is key and platform fidelity matters.
            </>
        )
    },
    {
        id: 'piece-of-logic',
        Tab: () => <>Piece of logic</>,
        actionLink: '/docs/multiplatform/multiplatform-ktor-sqldelight.html',
        Title: () => <>Stabilize and sync critical features.</>,
        Content: () => (
            <>
                Start by sharing an isolated, core part of your business logic&nbsp;– like calculations, validation
                rules, or authentication workflows – to improve consistency across platforms without requiring major
                architectural changes.
            </>
        )
    }
];

export function ChooseShareWhat({ className }: { className?: string }) {
    const textCn = useTextStyles();
    const [activeIndex, setActiveIndex] = useState(0);

    const navigateToHash = useTabScroll(TABS_BLOCKS, 'choose-share-what-', setActiveIndex);

    return (
        <section className={cn(className, styles.wrap, 'ktl-layout', 'ktl-layout--center')} data-testid={'share-what-block'}>
            <h2 className={cn(styles.title, textCn('rs-h1'))} data-testid={'share-what-title'}>Choose what to share</h2>

            <div role="tablist">
                <ChipList
                    size={'l'}
                    alignItems={'center'}
                    compact={true}
                    value={activeIndex}
                    onChange={v => setActiveIndex(v)}
                    className={cn(styles.tabs, 'rs-docs-offset-top-12')}
                >
                    {TABS_BLOCKS.map(({ id, Tab }, i) => (
                        <Chip key={id} className={styles.tab}
                              id={`choose-share-what-${id}-tab`} role="tab"
                              aria-controls={`choose-share-what-${id}-content`}
                              href={`#choose-share-what-${id}`} aria-label={`Go to ${id} section`}
                              onClick={navigateToHash} data-testid={'share-what-chip-anchor'}
                              {...(activeIndex === i && { 'aria-selected': true })}
                        >
                            <Tab />
                        </Chip>
                    ))}
                </ChipList>
            </div>

            <div className={cn(styles.cards)}>
                {TABS_BLOCKS.map(({ id, actionLink, Title, Content }, i) => <Fragment key={id}>
                    <a className={styles.anchor} id={`choose-share-what-${id}`} />
                    <CodeShareCard
                        id={`choose-share-what-${id}-content`} role="tabpanel"
                        aria-labelledby={`choose-share-what-${id}-tab`}
                        className={cn(styles.card, { [styles.active]: activeIndex === i })}
                        title={<Title />} imageName={`${id}`} url={actionLink}
                    >
                        <Content />
                    </CodeShareCard>
                </Fragment>)}
            </div>
        </section>
    );
}


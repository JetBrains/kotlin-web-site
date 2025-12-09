import { Fragment, useState } from 'react';
import cn from 'classnames';
import { useMS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';
import { useTextStyles } from '@rescui/typography';
import { Chip, ChipList } from '@rescui/chip-list';
import { AndroidIcon, AppleIcon, ComputerIcon, GlobusIcon, ServerIcon } from '@rescui/icons';

import styles from './choose-share-where.module.css';

import { useTabScroll } from '../../hooks/useTabScroll';


const TABS_BLOCKS = [
    {
        id: 'android',
        tab: 'Android',
        Icon: props => <AndroidIcon {...props} />,
        Content: () => (
            <>
                Easily make your Android app cross-platform while keeping the majority of your Kotlin code.<br/> Many popular
                libraries and architecture components&nbsp;– including those from Google, such as Room, DataStore, or
                ViewModel&nbsp;– can be used with Kotlin&nbsp;Multiplatform.
            </>
        )
    },
    {
        id: 'ios',
        tab: 'iOS',
        Icon: props => <AppleIcon {...props} />,
        Content: () => {
            const textCn = useTextStyles();
            return <>
                Share business logic seamlessly. Make your Kotlin functions available to call from Swift code, and use
                the full power of iOS APIs in your Kotlin code.<br/> Use <a className={textCn('rs-link', { external: true })}
                                                                       href="https://www.jetbrains.com/compose-multiplatform/">Compose
                Multiplatform</a> to create screens that can be embedded in SwiftUI, or build the entire user interface
                in Kotlin. Easily use platform-specific views like MapKit or AVFoundation straight from your
                Kotlin&nbsp;code.
            </>;
        }
    },
    {
        id: 'web',
        tab: 'Web',
        Icon: props => <GlobusIcon {...props} />,
        Content: () => (
            <>
                Share business logic with your web application and take advantage of Kotlin/Wasm and Compose
                Multiplatform to bring your app’s UX to the&nbsp;browser.
            </>
        )
    },
    {
        id: 'desktop',
        tab: 'Desktop',
        Icon: props => <ComputerIcon {...props} />,
        Content: () => {
            const textCn = useTextStyles();
            return <>
                Use Kotlin with <a className={textCn('rs-link', { external: true })}
                                   href="https://www.jetbrains.com/compose-multiplatform/">Compose Multiplatform</a> to
                build cross-platform desktop applications with shared business logic and a consistent UI across Windows,
                macOS, and Linux&nbsp;– hardware-accelerated rendering included!<br/> Use the well-established Kotlin and JVM
                ecosystems to quickly create your next desktop&nbsp;app.
            </>;
        }
    },
    {
        id: 'server',
        tab: 'Server',
        Icon: props => <ServerIcon {...props} />,
        Content: () => (
            <>
                Build your server-side applications with a modern JVM language, and use Kotlin Multiplatform to share
                data models, validation logic, and more.<br/> Use a framework like Ktor to get familiar APIs not just on the
                server, but also on the client, and maximize the amount of code and knowledge you can&nbsp;reuse.
            </>
        )
    }
];

export function ChooseShareWhere({ className }: { className?: string }) {
    const textCn = useTextStyles();
    const isMS = useMS();
    const [activeIndex, setActiveIndex] = useState(0);

    const navigateToHash = useTabScroll(TABS_BLOCKS, 'choose-share-where-', setActiveIndex);

    return (
        <section className={cn(className, styles.wrap, 'ktl-layout', 'ktl-layout--center')}>
            <h2 className={cn(styles.title, textCn('rs-h2'))}>Choose where to share</h2>

            <ChipList
                size={isMS ? 'm' : 'l'}
                alignItems={'center'}
                compact={true}
                value={activeIndex}
                onChange={v => setActiveIndex(v)}
                className={cn(styles.tabs, 'rs-docs-offset-top-12')}
                mode={'rock'}
            >
                {TABS_BLOCKS.map(({ id, tab, Icon }, i) => (
                    <Chip key={id} icon={<Icon size={isMS ? 'm' : 'l'} />} href={`#choose-share-where-${id}`}
                          className={cn(styles.tab, { [styles.activeChip]: activeIndex === i })}
                          aria-label={`Go to ${id} section`} role="tab" onClick={navigateToHash}>
                        {tab}
                    </Chip>
                ))}
            </ChipList>

            <div className={cn(styles.cards)}>
                {TABS_BLOCKS.map(({ id, Content }, i) => <Fragment key={id}>
                    <a id={`choose-share-where-${id}`} className={styles.anchor} />
                    <p className={cn(styles.card, textCn('rs-text-1'), { [styles.active]: activeIndex === i })}>
                        <Content />
                    </p>
                </Fragment>)}
            </div>
        </section>
    );
}
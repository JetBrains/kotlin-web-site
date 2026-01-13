import { useTextStyles } from '@rescui/typography';
import Link from 'next/link';
import { ThemeProvider } from '@rescui/ui-contexts';
import styles from './platforms-block.module.css';
import cn from 'classnames';
import { platformsData } from './platforms-data';
import { PlatformItem } from './platform-item';

const ContentBlock: React.FC = () => {
    const textCn = useTextStyles();
    return (
        <div className={styles.content}>
            <h2
                className={cn(textCn('rs-h1'), styles.title)}
            >
                An open-source, declarative framework for sharing stunning UIs across multiple platforms.
            </h2>
            <p className={cn(textCn('rs-subtitle-2'), styles.subtitle)}>
                Production-ready for mobile and desktop.
            </p>
            <p
                className={cn(textCn('rs-text-1', { hardness: 'hard' }), styles.text)}
            >
                Powered by{' '}
                <Link href="/multiplatform/" className={textCn('rs-link')}>
                    Kotlin&nbsp;Multiplatform
                </Link>{' '}
                and{' '}<Link
                href="https://developer.android.com/compose"
                className={textCn('rs-link', { external: true })}
                target="_blank"
            >
                Jetpack&nbsp;Compose
            </Link>.
                Developed by&nbsp;JetBrains.
            </p>
        </div>);
};

const SupportedPlatformsBlock = () => {
    const textCn = useTextStyles();
    return <div className={styles.supported}>
        <h3
            className={cn(textCn('rs-h1'), styles.title)}
        >
            Supported platforms
        </h3>
        <div
            className={styles.row}
        >
            {platformsData.map(item => (
                <PlatformItem
                    key={item.id}
                    {...item}
                />
            ))}
        </div>
    </div>;
};
export const PlatformsBlock = () => {
    const textCn = useTextStyles();

    return (
        <section className={cn(styles.hero, 'ktl-layout', 'ktl-layout--center')}>
            <div className={styles.wrapper} data-testid={'platforms-block'}>
                <ThemeProvider theme="light">
                    <ContentBlock />
                </ThemeProvider>
                <SupportedPlatformsBlock />
            </div>
        </section>
    );
};

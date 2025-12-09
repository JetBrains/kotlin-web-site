import cn from 'classnames';

import { useTextStyles } from '@rescui/typography';
import { Button } from '@rescui/button';

import { useML } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

import styles from './hero.module.css';

const platforms = ['Android', 'iOS', 'Web', 'Desktop', 'Server'] as const;

export function HeroBanner({ url }: { url: string }) {
    const isML = useML();
    const textCn = useTextStyles();

    return (
        <div className={styles.wrapper} data-testid={'hero-banner'}>
            <div className={cn(styles.hero, 'ktl-layout', 'ktl-layout--center')}>
                <h1 className={cn(styles.title, textCn('rs-hero'))} data-testid={'hero-title'}>
                    Kotlin Multiplatform
                </h1>
                <p className={cn(styles.subtitle, textCn('rs-subtitle-1'))} data-testid={'hero-subtitle'}>
                    Go&nbsp;cross&#8209;platform without&nbsp;compromising performance,&nbsp;UX, or&nbsp;code&nbsp;quality
                </p>
                <ul className={styles.platforms}>
                    {platforms.map((title) => {
                        const key = title.toLowerCase();

                        return (
                            <li
                                key={key}
                                data-testid={'hero-platfroms'}
                                className={cn(styles.platform, styles[`${key}`], textCn(isML ? 'rs-h5' : 'rs-h4'))}
                            >
                                {title}
                            </li>
                        );
                    })}
                </ul>
                <Button
                    className={cn(styles.button)}
                    mode={'rock'}
                    href={url}
                    size={isML ? 'm' : 'l'}
                    data-testid={'hero-action-button'}
                >
                    Get Started
                </Button>
            </div>
        </div>
    );
}

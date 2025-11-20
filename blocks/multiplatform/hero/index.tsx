import cn from 'classnames';

import { Button } from '@rescui/button';
import { useTextStyles } from '@rescui/typography';

import android from './icons/android.svg';
import ios from './icons/ios.svg';
import web from './icons/web.svg';
import desktop from './icons/desktop.svg';
import server from './icons/server.svg';

import logo from './logo.svg';

import styles from './hero.module.css';

const platforms = [
    { title: 'Android', icon: android },
    { title: 'iOS', icon: ios },
    { title: 'Web', icon: web },
    { title: 'Desktop', icon: desktop },
    { title: 'Server', icon: server }
] as const;

export function HeroBanner({ url }: { url: string }) {
    const textCn = useTextStyles();

    return (
        <div className={styles.wrapper}>
            <div className={cn(styles.hero, 'ktl-layout', 'ktl-layout--center')}
                 style={{ '--hero-logo-image': `url(${logo.src})` }}>
                <h1 className={cn(styles.title, textCn('rs-hero'))}>Kotlin Multiplatform</h1>
                <p className={cn(styles.subtitle, textCn('rs-subtitle-1'))}>
                    Go&nbsp;cross&#8209;platform without compromising performance,&nbsp;UX, or&nbsp;code&nbsp;quality
                </p>
                <ul className={styles.platforms}>
                    {platforms.map(({ title, icon }) => (
                        <li
                            key={title.toLowerCase()}
                            className={cn(styles.platform, textCn('rs-h4'))}
                            style={{ '--hero-item-src': `url(${icon.src})` }}
                        >
                            {title}
                        </li>
                    ))}
                </ul>
                <Button className={cn(styles.button)} mode={'rock'} href={url} size={'l'}>Get Started</Button>
            </div>
        </div>
    );
}

import cn from 'classnames';
import { createTextCn } from '@rescui/typography';
import styles from './platforms-block.module.css';
import { platformsData } from './platforms-data';
import { PlatformItem } from './platform-item';

export const PlatformsBlock = () => {
    const textCn = createTextCn('dark');

    return (
        <section className={cn(styles.platforms, 'ktl-layout', 'ktl-layout--center')} data-testid="platforms-block">
            <h2 className={cn(textCn('rs-h1'), styles.title)} data-testid="platforms-block-title">
                Supported platforms
            </h2>
            <ul className={styles.grid}>
                {platformsData.map(item => (
                    <PlatformItem key={item.id} {...item} />
                ))}
            </ul>
        </section>
    );
};

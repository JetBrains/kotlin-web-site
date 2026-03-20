import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import { ThemeProvider } from '@rescui/ui-contexts';

import '@jetbrains/kotlin-web-site-ui/out/components/layout';

import styles from './index.module.css';

import HeroImg from '../../images/hero-3600.webp';

interface Props {
    children: ReactNode;
}

export const HeroLayout: FC<Props> = ({ children }) => {
    return (
        <ThemeProvider theme={'dark'}>
            <section className={cn(styles.heroSection)} data-testid={'hero-block-ab-1'}>
                <img
                    className={styles.backgroundImg}
                    src={HeroImg.src}
                    width={1786}
                    height={1786}
                    alt={'Hero Image'}
                />
                <div className={cn('ktl-layout', 'ktl-layout--center', 'hero-b')}>
                    <div className={styles.content}>
                        {children}
                    </div>
                </div>
            </section>
        </ThemeProvider>
    );
};

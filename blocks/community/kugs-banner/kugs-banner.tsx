import Button from '@rescui/button';
import classnames from 'classnames';
import React, { FC } from 'react';
import styles from './kugs-banner.module.css';
import { ArrowRightIcon } from '@rescui/icons';
import { useTextStyles } from '@jetbrains/kotlin-web-site-ui/out/components/typography';

interface KugsBannerProps {
    title: string;
    children: React.ReactNode;
}

export const KugsBanner: FC<KugsBannerProps> = function ({ title, children }) {
    const textCn = useTextStyles();
    const linkClass = textCn('rs-link', { hardness: 'hard', mode: 'rock' });

    return (
        <div className={styles.banner}>
            <h1 className={'ktl-h1'}>{title}</h1>

            <div className={classnames(styles.content, 'ktl-text-1')}>
                <div className={styles.text}>{children}</div>

                <div className={styles.buttons}>
                    <Button
                        size={'l'}
                        href={'https://surveys.jetbrains.com/s3/submit-a-local-kotlin-user-group'}
                        iconPosition={'right'}
                        icon={<ArrowRightIcon />}
                    >
                        Start a New KUG
                    </Button>
                    <a
                        className={classnames(linkClass, styles.link)}
                        href={'https://kotlinlang.org/docs/kug-guidelines.html'}
                    >
                        KUG Guidelines
                    </a>
                </div>
            </div>
        </div>
    );
};

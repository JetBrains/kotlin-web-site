import React, { FC, ReactNode } from "react";
import { useTextStyles } from '@rescui/typography';

import styles from './info-block.module.css';
import classNames from 'classnames';
import { useTS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints';

interface InfoBlockProps {
    title: ReactNode;
    text: ReactNode;
    button: ReactNode;
    media: ReactNode;
}

export const InfoBlock: FC<InfoBlockProps> = ({title, text, button, media}) => {
    const textCn = useTextStyles();
    const isTS = useTS();
    const headerClass = isTS ? 'rs-h3' : 'rs-h2';

    return (
        <div className={styles.container}>
            <div className={styles.item}>
                <h2 className={classNames(textCn(headerClass), styles.title)}>{title}</h2>

                <div className={classNames(textCn('rs-text-2', { hardness: 'hard' }), styles.text)}>
                    {text}
                </div>

                {button}
            </div>

            <div className={classNames(styles.item, styles.media)}>
                {media}
            </div>
        </div>
    );
}

import { memo, ReactNode } from 'react';
import cn from 'classnames';

import { useTextStyles } from '@rescui/typography';
import { cardCn } from '@rescui/card';
import { Button } from '@rescui/button';

import styles from './choose-to-share-card.module.css';

type CodeShareCardProps = {
    className: string;
    title: ReactNode;
    url: string;
    children: ReactNode;
    imageName: string;
}

function Card({ className, title, url, imageName, children }: CodeShareCardProps) {
    const textCn = useTextStyles();

    return (
        <section className={cn(styles.card, className, cardCn())}>
            <div className={styles.content}>
                <h3 className={cn(styles.title, textCn('rs-h2'))}>{title}</h3>
                <p className={cn(styles.text, textCn('rs-text-1'))}>{children}</p>
                <Button className={styles.button} href={url} size={'l'} mode={'rock'}>Get started</Button>
            </div>
            <p className={styles.cover}>
                <img className={styles.image} src={`/images/multiplatform/choose-to-share/${imageName}.png`}
                     alt={imageName} />
            </p>
        </section>
    );
}

export const CodeShareCard = memo(Card);

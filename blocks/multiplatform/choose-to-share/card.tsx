import { ReactNode } from 'react';
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
}

export function CodeShareCard({ className, title, url, children }: CodeShareCardProps) {
    const textCn = useTextStyles();

    return (
        <section className={cn(styles.card, className, cardCn())}>
            <span className={styles.img}><img src={'/'} alt={'test img'} />s<br/>s<br/>s<br/>s<br/>s<br/>s<br/>s<br/>s<br/>s<br/>s<br/>s<br/>s<br/>s<br/>s<br/></span>
            <h3 className={cn(styles.title, textCn('rs-h2'))}>{title}</h3>
            <div className={cn(styles.text, textCn('rs-text-1'))}>{children}</div>
            <Button className={styles.button} href={url} size={'l'} mode={'rock'}>Get started</Button>
        </section>
    );
}

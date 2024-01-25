import cn from 'classnames';
import { CSSProperties } from 'react';
import dynamic from 'next/dynamic';

import { Img } from 'react-optimized-image';

import { useTextStyles } from '@rescui/typography';
import { Button } from '@rescui/button';
import { ArrowTopRightIcon } from '@rescui/icons';

const MascotAnimation = dynamic(import('./mascot'), {
    loading: () => null,
    ssr: false,
});

import styles from './latest-news.module.css';

import latestNews from '../../../latest-news/latest-news.json';

type NewsItem = {
    title: string;
    date: string;
    link: string;
    description: string;
};

type ItemProps = NewsItem & { position: number };

function Item({ title, date, link, description, position }: ItemProps) {
    const textCn = useTextStyles();
    const gridLine = Math.floor(position / 2);

    return (
        <a
            href={link}
            key={link}
            className={styles.item}
            target="_blank"
            rel="noopener noreferrer"
            style={
                {
                    '--ktl-news-position': position + 1,
                    '--ktl-news-grid-line': gridLine + 1,
                } as CSSProperties
            }
        >
            <div className={styles.image}>
                {/** require there is a workaround, the plugin doesn't work with variables **/}
                <Img
                    className={cn(styles.imageSrc)}
                    src={require(`../../../latest-news/news-${position}.png`)}
                    alt={title}
                    breakpoints={[374, 472, 616, 808, 1000, 1190]}
                    sizes={[272, 328, 424, 280, 248, 312, 280]}
                    densities={[1, 2]}
                />
            </div>
            <p className={cn(styles.date, textCn('rs-text-3'))}>
                {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h3 className={cn(styles.title, textCn('rs-h4'))}>{title}</h3>
            <div className={cn(styles.text, textCn('rs-text-3'))}>
                <p className={styles.description}>{description}</p>
            </div>
        </a>
    );
}

export function LatestNews() {
    const textCn = useTextStyles();

    return (
        <section className={styles.latestNews}>
            <h2 className={cn(styles.h, textCn('rs-h2'))}>Latest news</h2>
            <MascotAnimation className={styles.animation} />
            <div className={styles.news}>
                {latestNews.map((props, i) => (
                    <Item key={props.link} position={i} {...props} />
                ))}
            </div>
            <Button
                className={styles.blog}
                href="https://blog.jetbrains.com/kotlin/"
                mode="outline"
                icon={<ArrowTopRightIcon />}
                iconPosition="right"
                size={'l'}
            >
                Kotlin blog
            </Button>
        </section>
    );
}

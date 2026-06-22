import cn from 'classnames';
import { CSSProperties } from 'react';
import dynamic from 'next/dynamic';

import Image from 'next/image';
import news0 from '../../../latest-news/news-0.png';
import news1 from '../../../latest-news/news-1.png';
import news2 from '../../../latest-news/news-2.png';
import news3 from '../../../latest-news/news-3.png';

import { useTextStyles } from '@rescui/typography';
import { Button } from '@rescui/button';
import { ArrowTopRightIcon } from '@rescui/icons';

import { useTS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints';

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

const newsImages = [news0, news1, news2, news3];

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
                <Image
                    className={cn(styles.imageSrc)}
                    src={newsImages[position]}
                    alt={title}
                    sizes="(max-width: 374px) 272px, (max-width: 472px) 328px, (max-width: 616px) 424px, (max-width: 808px) 280px, (max-width: 1000px) 248px, (max-width: 1190px) 312px, 280px"
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

    const isTS = useTS();
    const headerClass = isTS ? 'rs-h3' : 'rs-h2';

    return (
        <section className={styles.latestNews}>
            <h2 className={cn(styles.h, textCn(headerClass))}>Latest news</h2>
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

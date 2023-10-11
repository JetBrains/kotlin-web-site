import cn from "classnames";

import Image from "next/image";

import { useTextStyles } from "@rescui/typography";
import { Button } from "@rescui/button";
import { ArrowTopRightIcon } from "@rescui/icons";

import styles from "./latest-news.module.css";

type NewsItem = {
  title: string;
  date: string;
  link: string;
  image: ImgSrc | string;
  description: string;
};

type ItemProps = NewsItem & { position: number };

function Item({ title, date, link, image, description, position }: ItemProps) {
  const textCn = useTextStyles();
  const gridLine = Math.floor(position / 2);

  return (
    <a href={link} key={link} className={styles.item} target="_blank" style={{
      "--ktl-news-position": position + 1,
      "--ktl-news-grid-line": gridLine + 1,
    }}>
      <div className={styles.image}>{[248, 272, 280, 312, 328, 424].map(width => (
        <Image key={width} className={cn(styles.imageSrc)} src={image} alt={title} width={width} />
      ))}</div>
      <p className={cn(styles.date, textCn('rs-text-3'))}>
        {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <h3 className={cn(styles.title, textCn('rs-h4'))}>{title}</h3>
      <div className={cn(styles.text, textCn("rs-text-3"))}>
        <p className={styles.description}>{description}</p>
      </div>
    </a>
  );
}

    export function LatestNews({news}: {news: NewsItem[]}) {
  const textCn = useTextStyles();

  return (
    <section className={styles.latestNews}>
      <h2 className={cn(styles.h, textCn('rs-h2'))}>Latest News</h2>
      <div className={styles.news}>
        {news.map((props, i) => <Item key={props.link} position={i} {...props} />)}
      </div>
      <Button className={styles.blog} href="https://blog.jetbrains.com/kotlin/" mode="outline"
              icon={<ArrowTopRightIcon />} iconPosition="right">
        Kotlin blog
      </Button>
    </section>
  );
}

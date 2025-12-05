import React from 'react';
import { Marquee } from '../marquee';
import styles from './index.module.css';

export interface LogoItem {
    id: ImgSrc;
    link: string;
}

const CustomerLogoMarqueeSection: React.FC<{ items: LogoItem[] }> = ({ items }) => {
    return (
        <section className={styles.section} data-testid={'customers-block'}>
            <Marquee className={styles.list} pauseOnHover hasFadingEdges>
                {items.map((item, index) => (
                    <a
                        href={item.link}
                        key={`logo_${index}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.logoLink}
                        data-testid="customers-link"
                    >
                        <img src={item.id.src} alt={item.link} className={styles.logo} />
                    </a>
                ))}
            </Marquee>
        </section>
    );
};

export default CustomerLogoMarqueeSection;

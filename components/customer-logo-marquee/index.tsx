import React from 'react';
import { Marquee } from '../marquee';
import styles from './index.module.css';

export interface LogoItem {
    id: string;
    logo: string;
    link: string;
}

const CustomerLogoMarqueeSection: React.FC<{ items: LogoItem[] }> = ({ items }) => {
    return (
        <section className={styles.section} data-testid={'customers-block'}>
            <Marquee className={styles.list} pauseOnHover hasFadingEdges>
                {items.map((item) => (
                    <a
                        key={item.id}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.logoLink}
                        data-testid="customers-link"
                    >
                        <img src={item.logo} alt={item.link} className={styles.logo} />
                    </a>
                ))}
            </Marquee>
        </section>
    );
};

export default CustomerLogoMarqueeSection;

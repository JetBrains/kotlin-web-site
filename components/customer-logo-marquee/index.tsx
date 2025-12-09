import React from 'react';
import cn from 'classnames';
import { Marquee } from '../marquee';
import styles from './index.module.css';

export interface LogoItem {
    id: string;
    logo: string;
    link: string;
}

const CustomerLogoMarqueeSection: React.FC<{ className: string, items: LogoItem[] }> = ({ className, items }) => {
    return (
        <section className={cn(styles.section, className)} data-testid={'customers-block'}>
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

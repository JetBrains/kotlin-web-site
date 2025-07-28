import React from 'react';
import { Marquee } from '../marquee';
import styles from './index.module.css';

import logos from './customer-logo-marquee-data';

const CustomerLogoMarqueeSection: React.FC = () => {
    return (
        <section className={styles.section}>
            <Marquee className={styles.list} pauseOnHover hasFadingEdges>
                {logos.map((item, index) => (
                    <a
                        href={item.link}
                        key={`logo_${index}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.logoLink}
                    >
                        <img src={item.id.src} alt={item.link} className={styles.logo} />
                    </a>
                ))}
            </Marquee>
        </section>
    );
};

export default CustomerLogoMarqueeSection;

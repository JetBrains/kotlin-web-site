import styles from './promo-banner.module.css';
import cn from 'classnames';

import mobileImg from '../../../public/images/main/promo-banner/mobile.png';
import wideImg from '../../../public/images/main/promo-banner/wide.png';

export const PromoBanner = () => {
    return (
        <div className={cn('ktl-layout', 'ktl-layout--center', styles.wrapper)}>
            <a href={'/lp/kotlin-for-business/'} className={styles.link}>
                <picture>
                    {/* Mobile: up to 616px */}
                    <source media="(max-width: 616px)" srcSet={`${mobileImg.src}`} />
                    {/* Tablet: 617px to 808px */}

                    {/* Wide format: 809px and above */}
                    <source media="(min-width: 809px)" srcSet={`${wideImg.src}`} />
                    {/* Fallback image */}
                    <img className={styles.image} src={wideImg.src} alt={'KotlinConf banner'} />
                </picture>
            </a>
        </div>
    );
}

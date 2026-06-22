import styles from './promo-banner.module.css';
import cn from 'classnames';

import mobileImg from '../../../public/images/main/promo-banner/mobile.jpg';
import mobile2xImg from '../../../public/images/main/promo-banner/mobile@2x.jpg';
import tabletImg from '../../../public/images/main/promo-banner/tablet.jpg';
import tablet2xImg from '../../../public/images/main/promo-banner/tablet@2x.jpg';
import wideImg from '../../../public/images/main/promo-banner/wide.jpg';
import wide2xImg from '../../../public/images/main/promo-banner/wide@2x.jpg';

export const PromoBanner = () => {
    return (
        <div className={cn('ktl-layout', 'ktl-layout--center', styles.wrapper)}>
            <a href={'/lp/kotlin-for-business/'} className={styles.link}>
                <picture>
                    <source media="(max-width: 616px)" srcSet={`${mobileImg.src} 1x, ${mobile2xImg.src} 2x`} />

                    <source media="(min-width: 617px) and (max-width: 808px)" srcSet={`${tabletImg.src} 1x, ${tablet2xImg.src} 2x`} />

                    <source media="(min-width: 809px)" srcSet={`${wideImg.src} 1x, ${wide2xImg.src} 2x`} />

                    <img className={styles.image} src={wideImg.src} alt={'KotlinConf banner'} />
                </picture>
            </a>
        </div>
    );
}

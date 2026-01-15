import styles from './kotlin-conf-banner.module.css';
import cn from 'classnames';

import mobileImg1x from '../../../public/images/main/kotlin-conf-banner/mobile@1x.png';
import mobileImg2x from '../../../public/images/main/kotlin-conf-banner/mobile@2x.png';
import tabletImg1x from '../../../public/images/main/kotlin-conf-banner/tablet@1x.png';
import tabletImg2x from '../../../public/images/main/kotlin-conf-banner/tablet@2x.png';
import wideImg1x from '../../../public/images/main/kotlin-conf-banner/wide@1x.png';
import wideImg2x from '../../../public/images/main/kotlin-conf-banner/wide@2x.png';


export const KotlinConfBanner = () => {
    return (
        <div className={cn('ktl-layout', 'ktl-layout--center', styles.wrapper)}>
            <a
                href={'https://kotlinconf.com/?utm_campaign=kc_promo&utm_medium=banner&utm_source=kotlinlang'}
                className={styles.link}
                target="_blank"
                rel="noreferrer"
            >
                <picture>
                    {/* Mobile: up to 616px */}
                    <source
                        media="(max-width: 616px)"
                        srcSet={`${mobileImg1x.src} 1x, ${mobileImg2x.src} 2x`}
                    />
                    {/* Tablet: 617px to 808px */}
                    <source
                        media="(min-width: 617px) and (max-width: 808px)"
                        srcSet={`${tabletImg1x.src} 1x, ${tabletImg2x.src} 2x`}
                    />
                    {/* Wide format: 809px and above */}
                    <source
                        media="(min-width: 809px)"
                        srcSet={`${wideImg1x.src} 1x, ${wideImg2x.src} 2x`}
                    />
                    {/* Fallback image */}
                    <img
                        className={styles.image}
                        src={wideImg1x.src}
                        alt={'KotlinConf banner'}
                    />
                </picture>
            </a>
        </div>
    );
}

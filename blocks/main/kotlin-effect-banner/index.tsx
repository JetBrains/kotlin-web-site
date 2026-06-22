import styles from './kotlin-effect-banner.module.css';
import cn from 'classnames';

import mobileImg from '../../../public/images/main/kotlin-effect-banner/mobile.jpg';
import mobile2xImg from '../../../public/images/main/kotlin-effect-banner/mobile@2x.jpg';
import mobileLImg from '../../../public/images/main/kotlin-effect-banner/mobile_l.jpg';
import mobileL2xImg from '../../../public/images/main/kotlin-effect-banner/mobile_l@2x.jpg';
import tabletSImg from '../../../public/images/main/kotlin-effect-banner/tablet_s.jpg';
import tabletS2xImg from '../../../public/images/main/kotlin-effect-banner/tablet_s@2x.jpg';
import tabletLImg from '../../../public/images/main/kotlin-effect-banner/tablet_l.jpg';
import tabletL2xImg from '../../../public/images/main/kotlin-effect-banner/tablet_l@2x.jpg';
import desktopLImg from '../../../public/images/main/kotlin-effect-banner/desktop_l.jpg';
import desktopL2xImg from '../../../public/images/main/kotlin-effect-banner/desktop_l@2x.jpg';
import Link from 'next/link';

export const KotlinEffectBanner = () => {
    return (
        <div className={cn('ktl-layout', 'ktl-layout--center', styles.wrapper)}>
            <Link href={'/kotlin-effect/'} className={styles.link}>
                <picture>
                    <source media="(max-width: 472px)" srcSet={`${mobileImg.src} 1x, ${mobile2xImg.src} 2x`} />

                    <source media="(min-width: 473px) and (max-width: 616px)" srcSet={`${mobileLImg.src} 1x, ${mobileL2xImg.src} 2x`} />

                    <source media="(min-width: 617px) and (max-width: 808px)" srcSet={`${tabletSImg.src} 1x, ${tabletS2xImg.src} 2x`} />

                    <source media="(min-width: 809px) and (max-width: 1000px)" srcSet={`${tabletLImg.src} 1x, ${tabletL2xImg.src} 2x`} />

                    <source media="(min-width: 1001px)" srcSet={`${desktopLImg.src} 1x, ${desktopL2xImg.src} 2x`} />

                    <img className={styles.image} src={desktopLImg.src} alt={'Kotlin Effect banner'} />
                </picture>
            </Link>
        </div>
    );
};

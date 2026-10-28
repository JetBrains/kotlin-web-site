import cn from 'classnames';
import Img from 'next/image';
import Link from 'next/link';
import { createTextCn } from '@rescui/typography';
import { InstagramIcon, LocationOutlineIcon, TargetOutlineIcon } from '@rescui/icons';
import { useML } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';
import styles from './platform-benefits-block.module.css';
import { FEATURE_CARDS, NATIVE_FEATURES } from './platform-benefits-data';
import { PhoneVideo } from './phone-video';

import gradualAdoptionImage from './images/gradual-adoption.png';

export const PlatformBenefitsBlock = () => {
    const textCn = createTextCn('dark');
    const isML = useML();
    const iconSize = isML ? 'm' : 'l';

    const titleCn = cn(textCn('rs-h2'), styles.cardTitle);
    const textCnAverage = textCn('rs-text-2');

    return (
        <section className={cn(styles.platformBenefits, 'ktl-layout', 'ktl-layout--center')}>
            <div className={styles.grid} data-testid="platform-benefits-block">
                <div className={cn(styles.card, styles.wideCard)} data-testid="platform-benefits-item">
                    <div className={styles.cardContent}>
                        <h2 className={titleCn} data-testid="platform-benefits-title">
                            Native experiences
                        </h2>
                        <div className={textCnAverage}>
                            <p className={styles.nativeIntro}>
                                Feels like iOS because it is.
                                <br />
                                With Kotlin Multiplatform, you get:
                            </p>
                            <ul className={styles.nativeList}>
                                {NATIVE_FEATURES.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.apis}>
                            <div className={styles.apisText}>
                                <h3 className={cn(textCn('rs-h3'), styles.apisTitle)}>
                                    Need camera, maps or platform APIs?
                                </h3>
                                <p className={cn(textCnAverage, styles.cardText)}>
                                    Access native APIs whenever you need them.
                                </p>
                            </div>
                            <div className={styles.apisIcons} aria-hidden="true">
                                <InstagramIcon size={iconSize} theme="dark" />
                                <LocationOutlineIcon size={iconSize} theme="dark" />
                                <TargetOutlineIcon size={iconSize} theme="dark" />
                            </div>
                        </div>
                    </div>
                    <div className={styles.cardMedia}>
                        <PhoneVideo />
                    </div>
                </div>

                <div className={cn(styles.card, styles.wideCard)} data-testid="platform-benefits-item">
                    <div className={styles.cardContent}>
                        <h2 className={titleCn} data-testid="platform-benefits-title">
                            Gradual adoption
                        </h2>
                        <p className={cn(textCnAverage, styles.cardText)}>
                            Start small or go all in without extra work – Compose Multiplatform fits into your existing
                            app, whether you’re sharing one component, one screen, or the entire UI. Keep your existing
                            SwiftUI, Android Views, or Swing code – there’s no need to rewrite anything. Learn from the{' '}
                            <Link
                                href="/case-studies/?type=multiplatform&compose=true"
                                className={textCn('rs-link', { hardness: 'hard' })}
                            >
                                experience of other companies
                            </Link>
                            .
                        </p>
                    </div>
                    <div className={cn(styles.cardMedia, styles.adoptionImage)}>
                        <Img
                            src={gradualAdoptionImage}
                            alt="An existing app adopting shared Compose Multiplatform UI one screen at a time"
                            sizes="(max-width: 1000px) 100vw, 640px"
                        />
                    </div>
                </div>

                {FEATURE_CARDS.map(({ id, title, text }) => (
                    <div key={id} className={cn(styles.card, styles.featureCard)} data-testid="platform-benefits-item">
                        <h3 className={titleCn} data-testid="platform-benefits-title">
                            {title}
                        </h3>
                        <p className={cn(textCnAverage, styles.cardText)}>{text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

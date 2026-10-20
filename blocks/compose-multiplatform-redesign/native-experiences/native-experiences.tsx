/**
 * Features zone: native experiences (video poster), gradual adoption and four feature cards.
 */
import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import Button from '@rescui/button';
import { InstagramIcon, LocationOutlineIcon, PlayIcon, TargetOutlineIcon } from '@rescui/icons';
import { useML } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

import { FEATURE_CARDS, NATIVE_FEATURES } from './native-experiences-data';

import styles from './native-experiences.module.css';

export const NativeExperiencesSection: FC = () => {
    const textCn = useTextStyles();
    const isML = useML();
    const iconSize = isML ? 'm' : 'l';
    const title = cn(styles.title, textCn('rs-h3'));
    const body = cn(styles.body, textCn('rs-text-2'));

    return (
        <section
            className={styles.wrapper}
            id="native-experiences"
            data-testid="compose-multiplatform-redesign-native-experiences"
        >
            <div className={styles.grid}>
                <div className={cn(styles.card, styles.native)}>
                    <div className={styles.nativeText}>
                        <h2 className={title} data-testid="compose-multiplatform-redesign-native-experiences-title">
                            Native experiences
                        </h2>
                        <div className={styles.nativeBody}>
                            <div className={styles.nativeList}>
                                <p className={body}>Feels like iOS because it is.</p>
                                <ul className={cn(styles.list, body)}>
                                    {NATIVE_FEATURES.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.apis}>
                                <div className={styles.apisText}>
                                    <h3 className={cn(styles.subtitle, textCn('rs-h3'))}>
                                        Need camera, maps or platform APIs?
                                    </h3>
                                    <p className={body}>Access native APIs whenever you need them.</p>
                                </div>
                                <div className={styles.pills} aria-hidden="true">
                                    <InstagramIcon size={iconSize} theme="dark" />
                                    <LocationOutlineIcon size={iconSize} theme="dark" />
                                    <TargetOutlineIcon size={iconSize} theme="dark" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Video in the mock; no raster for it, so a poster-sized placeholder with the play button */}
                    <div className={styles.videoWrap}>
                        <div
                            className={styles.video}
                            role="img"
                            aria-label="Compose Multiplatform app video (placeholder)"
                        >
                            <Button
                                className={styles.play}
                                mode="classic"
                                size="l"
                                theme="dark"
                                aria-label="Play video"
                                icon={<PlayIcon theme="dark" />}
                            />
                        </div>
                    </div>
                </div>

                <div className={cn(styles.card, styles.adoption)}>
                    <div className={styles.adoptionText}>
                        <h2 className={title}>Gradual adoption</h2>
                        <p className={cn(styles.body, textCn('rs-text-2'))}>
                            Start small or go all in without extra work – Compose Multiplatform fits into your existing
                            app, whether you’re sharing one component, one screen, or the entire UI. Keep your existing
                            SwiftUI, Android Views, or Swing code – there’s no need to rewrite anything. Learn from the{' '}
                            <a
                                className={styles.link}
                                href="https://kotlinlang.org/case-studies/?type=multiplatform"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                experience of other companies
                            </a>
                            .
                        </p>
                    </div>
                    <div className={styles.adoptionImage}>
                        <img
                            src="/images/compose-multiplatform-redesign/native-experiences-adoption.png"
                            alt="Three app screens connected by a flow: existing app, one shared screen, shared UI"
                            width={640}
                            height={394}
                        />
                    </div>
                </div>

                {FEATURE_CARDS.map((card) => (
                    <div key={card.id} className={cn(styles.card, styles.feature)}>
                        <h3 className={title}>{card.title}</h3>
                        <p className={cn(styles.body, textCn('rs-text-2'), styles.featureText)}>{card.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

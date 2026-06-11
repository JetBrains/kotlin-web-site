import cn from 'classnames';
import { useTextStyles, createTextCn } from '@rescui/typography';

import styles from './offer-block.module.css';
import { Button } from '@rescui/button';
import { Tag, presets as basePresets } from '@rescui/tag';
import { WinIcon } from '@rescui/icons';

import offerKodee from './images/meditation-kodee.webp';

export const OfferBlock = () => {
    const textCn = useTextStyles();
    const darkTextCn = createTextCn('dark');

    const tagPresets = {
        ...basePresets,
        light: { color: 'white', backgroundColor: '#19191C' }
    };

    return (
        <div
            className={styles.offerSection}
            data-test="card-stack-card"
            id={'yours-kotlin-effect'}
        >
            <div className={styles.cardContent}>
                <h2 className={cn(textCn('rs-h1'), styles.sectionTitle)}>
                    Make the Kotlin Effect <span>Yours</span>
                </h2>
                <p className={cn(textCn('rs-subtitle-2'), styles.sectionSubtitle)}>
                    Move from fundamentals to real-world development – across<br /> mobile, backend, web, and
                    desktop applications.
                </p>
            </div>

            <div className={cn(styles.card)}>

                <img src={offerKodee.src} alt="Meditation Kodee background image" className={styles.offerImage} />

                <div className={styles.offerContainer}>

                    <div>
                        <Tag {...tagPresets.light} size={'l'} icon={<WinIcon color={'#6B57FF'} />}>
                            Exclusive
                            anniversary offer
                        </Tag>

                        <h3 className={cn(textCn('rs-subtitle-2'), styles.offerTitle)}>Get free access to select Kotlin
                            courses on
                            Hyperskill!
                        </h3>
                    </div>

                    <div className={styles.buttonContainer}>
                        <Button mode={'rock'} size={'l'} href="https://hyperskill.org/categories/37" className={styles.button}>
                            Start learning
                        </Button>
                    </div>

                </div>
            </div>

            <div className={styles.linksGrid}>
                <div className={styles.linksContainer}>
                    <h3 className={cn(darkTextCn('rs-h3'), styles.linksSubtitle)}>Get started</h3>
                    <ul className={cn(textCn('rs-ul'), styles.linksUl)}>
                        <li className={styles.linksLi}>
                            <a
                                href="https://hyperskill.org/courses/69-introduction-to-kotlin"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                            >
                                Introduction to Kotlin
                            </a>
                        </li>
                        <li className={styles.linksLi}>
                            <a
                                href="https://academy.jetbrains.com/course/21067"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                            >
                                Kotlin Onboarding
                            </a>
                        </li>
                        <li className={styles.linksLi}>
                            <a
                                href="https://academy.jetbrains.com/course/17654"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                            >
                                Atomic Kotlin
                            </a>
                        </li>
                        <li className={styles.linksLi}>
                            <a
                                href="https://academy.jetbrains.com/course/16628"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                            >
                                Kotlin Koans
                            </a>
                        </li>
                    </ul>
                </div>
                <div className={styles.linksContainer}>
                    <h3 className={cn(darkTextCn('rs-h3'), styles.linksSubtitle)}>
                        Build real projects
                    </h3>
                    <ul className={cn(textCn('rs-ul'), styles.linksUl)}>
                        <li className={styles.linksLi}>
                            <a
                                href="https://hyperskill.org/courses/18-kotlin-core"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                            >
                                Kotlin Core
                            </a>
                        </li>
                        <li className={styles.linksLi}>
                            <a
                                href="https://hyperskill.org/courses/3-kotlin-developer"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                            >
                                Kotlin Developer
                            </a>
                        </li>
                        <li className={styles.linksLi}>
                            <a
                                href="https://developer.android.com/courses/jetpack-compose/course"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                            >
                                Jetpack Compose for Android Developers
                            </a>
                        </li>
                    </ul>
                </div>
                <div className={styles.linksContainer}>
                    <h3 className={cn(darkTextCn('rs-h3'), styles.linksSubtitle)}>
                        Explore professional tracks
                    </h3>
                    <ul className={cn(textCn('rs-ul'), styles.linksUl)}>
                        <li className={styles.linksLi}>
                            <a
                                href="https://hyperskill.org/courses/45-introduction-to-ktor"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                            >
                                Introduction to Ktor
                            </a>
                        </li>
                        <li className={styles.linksLi}>
                            <a
                                href="https://academy.jetbrains.com/course/23312"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                            >
                                Kotlin Coroutines and Channels
                            </a>
                        </li>
                        <li className={styles.linksLi}>
                            <a
                                href="https://hyperskill.org/courses/107"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                            >
                                Advanced Kotlin Libraries and Techniques
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

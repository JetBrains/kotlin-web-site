import cn from 'classnames';
import { useTextStyles, createTextCn } from '@rescui/typography';

import styles from './offer-block.module.css';

export const OfferBlock = () => {
    const textCn = useTextStyles();
    const darkTextCn = createTextCn('dark');

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

            <div className={styles.linksGrid}>
                <div className={styles.linksContainer}>
                    <h3 className={cn(darkTextCn('rs-h3'), styles.linksSubtitle)}>Get started</h3>
                    <ul className={cn(textCn('rs-ul'), styles.linksUl)}>
                        <li className={styles.linksLi}>
                            <a
                                href="https://hyperskill.org/courses/69-introduction-to-kotlin?utm_source=kotlinlang&utm_medium=referral&utm_campaign=kotlin15&utm_content=introduction_to_kotlin"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                target="_blank" rel="noopener noreferrer"
                            >
                                Introduction to Kotlin
                            </a>
                        </li>
                        <li className={styles.linksLi}>
                            <a
                                href="https://academy.jetbrains.com/course/21067"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                target="_blank" rel="noopener noreferrer"
                            >
                                Kotlin Onboarding
                            </a>
                        </li>
                        <li className={styles.linksLi}>
                            <a
                                href="https://academy.jetbrains.com/course/17654"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                target="_blank" rel="noopener noreferrer"
                            >
                                Atomic Kotlin
                            </a>
                        </li>
                        <li className={styles.linksLi}>
                            <a
                                href="https://academy.jetbrains.com/course/16628"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                target="_blank" rel="noopener noreferrer"
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
                                href="https://hyperskill.org/courses/18-kotlin-core?utm_source=kotlinlang&utm_medium=referral&utm_campaign=kotlin15&utm_content=kotlin_core"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                target="_blank" rel="noopener noreferrer"
                            >
                                Kotlin Core
                            </a>
                        </li>
                        <li className={styles.linksLi}>
                            <a
                                href="https://hyperskill.org/courses/3-kotlin-developer?utm_source=kotlinlang&utm_medium=referral&utm_campaign=kotlin15&utm_content=kotlin_developer"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                target="_blank" rel="noopener noreferrer"
                            >
                                Kotlin Developer
                            </a>
                        </li>
                        <li className={styles.linksLi}>
                            <a
                                href="https://developer.android.com/courses/jetpack-compose/course"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                target="_blank" rel="noopener noreferrer"
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
                                href="https://hyperskill.org/courses/45-introduction-to-ktor?utm_source=kotlinlang&utm_medium=referral&utm_campaign=kotlin15&utm_content=introduction_to_ktor"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                target="_blank" rel="noopener noreferrer"
                            >
                                Introduction to Ktor
                            </a>
                        </li>
                        <li className={styles.linksLi}>
                            <a
                                href="https://academy.jetbrains.com/course/23312"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                target="_blank" rel="noopener noreferrer"
                            >
                                Kotlin Coroutines and Channels
                            </a>
                        </li>
                        <li className={styles.linksLi}>
                            <a
                                href="https://hyperskill.org/courses/107?utm_source=kotlinlang&utm_medium=referral&utm_campaign=kotlin15&utm_content=libraries"
                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                target="_blank" rel="noopener noreferrer"
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

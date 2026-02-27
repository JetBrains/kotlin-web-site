import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import Button from '@rescui/button';
import styles from './teach-launch-course.module.css';

export const TeachLaunchCourse: FC = () => {
    const textCn = useTextStyles();

    return (
        <div className={styles.launchCourse}>
            <div className={cn('ktl-text-1', styles.text)} data-test="teach-launch-course">
                The Programming in Kotlin course is a comprehensive toolkit for teaching Kotlin and can be easily
                customized to align with specific educational needs. The course comes with slides, lecture notes, and
                assessment resources.
                <div className={styles.buttonWrap}>
                    <Button
                        href="https://drive.google.com/drive/folders/1nN3LuyEfmBaSDZpnb4VA9kDuLakmVXH1?usp=drive_link"
                        target="_blank"
                        rel="noopener"
                        size="l"
                        className={styles.button}
                    >
                        Download all materials&nbsp;&rarr;
                    </Button>
                </div>
            </div>

            <div className={cn(styles.linksBlock, styles.linksBlockFirst)}>
                <div className={cn(textCn('rs-h4'), 'ktl-offset-bottom-xs')}>Lecture slides</div>
                <ul className={cn(styles.list, styles.listLarge, textCn('rs-text-2'))}>
                    <li>
                        <a
                            className={textCn('rs-link', { external: true })}
                            href="https://docs.google.com/presentation/d/18EB_yQ6O9hOiyyyxTqSr-4fWpU-8NvJSRqRosSWFsSE/edit?usp=drive_link"
                        >
                            Introduction to Kotlin
                        </a>
                    </li>
                    <li>
                        <a
                            className={textCn('rs-link', { external: true })}
                            href="https://docs.google.com/presentation/d/1RvnmqWM-Q_hYi1dWwqN1ieK2pZAwlThOkLI9j5yqViU/edit?usp=drive_link"
                        >
                            Object-oriented programming
                        </a>
                    </li>
                    <li>
                        <a
                            className={textCn('rs-link', { external: true })}
                            href="https://docs.google.com/presentation/d/1R7n5plsn5caGpYrI9omxbEuX6pazjDj2d9X0IQ2AdLg/edit?usp=drive_link"
                        >
                            Generics
                        </a>
                    </li>
                    <li>
                        <a
                            className={textCn('rs-link', { external: true })}
                            href="https://docs.google.com/presentation/d/1o0c25j-5UKE1Qw94W26numHxMU_xL0uFchCWJfaOuUc/edit?usp=drive_link"
                        >
                            Collections
                        </a>
                    </li>
                    <li>
                        <a
                            className={textCn('rs-link', { external: true })}
                            href="https://docs.google.com/presentation/d/19C10TZM1kT0AzEjqSfLZs1_HC3Ye0E9h6muVDikl4uo/edit?usp=drive_link"
                        >
                            Functional programming
                        </a>
                    </li>
                    <li>
                        <a
                            className={textCn('rs-link', { external: true })}
                            href="https://docs.google.com/presentation/d/1n8rTULotZHei3ktajyupwRpKdPDACBAZeBo2GqwYhHY/edit?usp=drive_link"
                        >
                            Parallel and concurrent programming
                        </a>
                    </li>
                    <li>
                        <a
                            className={textCn('rs-link', { external: true })}
                            href="https://docs.google.com/presentation/d/1WT0kVeLpZ8-cS1211oXVvjPesgPgTJxIuIJHkU6-49k/edit?usp=drive_link"
                        >
                            Asynchronous programming
                        </a>
                    </li>
                    <li>
                        <a
                            className={textCn('rs-link', { external: true })}
                            href="https://docs.google.com/presentation/d/1_F9CVHdbXoRagLUpBGjpwS9DDbzB2K-Cfv4Pz5qKza4/edit?usp=drive_link"
                        >
                            Exceptions
                        </a>
                    </li>
                    <li>
                        <a
                            className={textCn('rs-link', { external: true })}
                            href="https://docs.google.com/presentation/d/1sAzzlOs4H3MYEUUYb5NnmAOJsO9YQSss4YAywZaNDJw/edit?usp=drive_link"
                        >
                            Testing
                        </a>
                    </li>
                    <li>
                        <a
                            className={textCn('rs-link', { external: true })}
                            href="https://docs.google.com/presentation/d/1Plt2cpm-GRzxHt1Vu8C90FWnuSYToucWXPLaJKlBRMc/edit?usp=sharing"
                        >
                            Build systems
                        </a>
                    </li>
                    <li>
                        <a
                            className={textCn('rs-link', { external: true })}
                            href="https://docs.google.com/presentation/d/11mYc_tt2c7qw72i8gaQ9vePTcd0F0LbZCS6ep9PFG28/edit?usp=drive_link"
                        >
                            JVM + the Kotlin compiler
                        </a>
                    </li>
                    <li>
                        <a
                            className={textCn('rs-link', { external: true })}
                            href="https://docs.google.com/presentation/d/1hZTaQ1gdStte2aeQU78UmpVzpKErdeOCRQPOYH2p3DI/edit?usp=drive_link"
                        >
                            Reflection (JVM)
                        </a>
                    </li>
                </ul>
            </div>

            <div className={cn(styles.linksBlock, styles.linksBlockSecond)}>
                <div className={cn(textCn('rs-h4'), 'ktl-offset-bottom-xs')}>
                    <a
                        className={textCn('rs-link', { external: true })}
                        href="https://docs.google.com/document/d/1plW4HJQWuzHDRI2QiTr8hqg5WwIMFQ0Le9AoUmiw3qY/edit?usp=drive_link"
                    >
                        Syllabus
                    </a>
                </div>

                <div className={cn(textCn('rs-h4'), 'ktl-offset-bottom-xs')}>Assessment resources</div>

                <ul className={cn(styles.list, textCn('rs-text-2'))}>
                    <li>
                        <a
                            className={textCn('rs-link', { external: true })}
                            href="https://forms.gle/UJ91acwMAk17qax7A"
                        >
                            Quizzes
                        </a>
                    </li>
                    <li>
                        <a className={textCn('rs-link', { external: true })} href="https://forms.gle/GhtGZHprkTUzr5hV6">
                            Homework assignments
                        </a>
                    </li>
                    <li>
                        <a className={textCn('rs-link', { external: true })} href="https://forms.gle/wTm3M8GfgaVCsxsQ8">
                            Tests
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

import React from 'react';

import { useTextStyles } from '@rescui/typography';
import './teach-launch-course.scss';

import Button from '@rescui/button';

import classNames from 'classnames';

export const TeachLaunchCourse = () => {
    const textCn = useTextStyles();

    return (
        <div className="teach-launch-course">
            <div className="ktl-text-1 teach-launch-course__text">
                The Programming in Kotlin course is a comprehensive toolkit for teaching Kotlin and can be easily
                customized to align with specific educational needs. The course comes with slides, lecture notes, and
                assessment resources.
                <div className={'teach-launch-course__button-wrap'}>
                    <Button
                        href="https://drive.google.com/drive/folders/1nN3LuyEfmBaSDZpnb4VA9kDuLakmVXH1?usp=drive_link"
                        target="_blank"
                        rel="noopener"
                        size="l"
                        className="teach-launch-course__button"
                    >
                        Download all materials&nbsp;→
                    </Button>
                </div>
            </div>

            <div className="teach-launch-course__links-block teach-launch-course__links-block_first">
                <div className="ktl-h4 ktl-offset-bottom-xs">Lecture slides</div>
                <ul
                    className={classNames(
                        'teach-launch-course__list teach-launch-course__list_large',
                        textCn('rs-text-2')
                    )}
                >
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
                            href="https://docs.google.com/presentation/d/1Plt2cpm-GRzxHt1Vu8C90FWnuSYToucWXPLaJKlBRMc/edit?usp=drive_link"
                        >
                            Build systems
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
                            href="https://docs.google.com/presentation/d/11mYc_tt2c7qw72i8gaQ9vePTcd0F0LbZCS6ep9PFG28/edit?usp=drive_link"
                        >
                            JVM + the Kotlin compiler
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
                </ul>
            </div>

            <div className="teach-launch-course__links-block teach-launch-course__links-block_second">
                <div className="ktl-h4 ktl-offset-bottom-xs">
                    <a
                        className={textCn('rs-link', { external: true })}
                        href="https://docs.google.com/document/d/1plW4HJQWuzHDRI2QiTr8hqg5WwIMFQ0Le9AoUmiw3qY/edit?usp=drive_link"
                    >
                        Syllabus
                    </a>
                </div>

                <div className="ktl-h4 ktl-offset-bottom-xs">Assessment resources</div>

                <ul className={classNames('teach-launch-course__list', textCn('rs-text-2'))}>
                    <li>
                        <a
                            className={textCn('rs-link', { external: true })}
                            href=" https://forms.gle/UJ91acwMAk17qax7A"
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

import React, { FC } from 'react';

import cn from 'classnames';

import styles from './get-started.module.css';
import { useTextStyles } from '@rescui/typography';

import ktorLogo from './images/ktor.svg';
import springLogo from './images/spring.svg';

import Img from 'next/image';
import getStartedGraphics from './images/get-started-graphics-cut.webp';

import Link from 'next/link';

export const GetStarted: FC = ({}) => {

    const textCn = useTextStyles();

    return (
        <section className={cn(styles.wrapper)} data-testid={'get-started-block'}>

            <div className={cn('ktl-layout', 'ktl-layout--center')} id={'get-started'}>

                <Img className={styles.backgroundImage} src={getStartedGraphics} alt={'Get started graphic'} height={605} />

                <div className={cn("ktl-container", styles.content)}>

                    <h2 className={cn(textCn('rs-h1'))}>
                        Get started
                    </h2>

                    <div className="ktl-row ktl-offset-top-l">
                        <div className="ktl-col-12 ktl-col-md-6">
                            <Link className={styles.card}  data-testid={'ktor-get-started-link'} href={'https://ktor.io/docs/welcome.html'}>
                                <div className={styles.image}>
                                    <img src={ktorLogo.src} alt="Ktor Logo" />
                                </div>
                                <div className={styles.title}>
                                    <h2 className={textCn('rs-h2')}>
                                        Ktor quick start
                                    </h2>
                                </div>
                                <div className={styles.text}>
                                    <p className={textCn('rs-text-2')}>
                                        Ktor is a multiplatform toolkit built by JetBrains for creating Web applications
                                        in
                                        Kotlin. It makes use of coroutines for high scalability and offers an
                                        easy-to-use
                                        API.
                                    </p>
                                </div>
                            </Link>
                        </div>

                        <div className={cn("ktl-col-12 ktl-col-md-6", "spacer-md")}>
                            <Link className={styles.card}  data-testid={'spring-get-started-link'} href={'/docs/jvm-get-started-spring-boot.html'}>
                                <div className={styles.image}>
                                    <img src={springLogo.src} alt="Spring Logo" />
                                </div>
                                <div className={styles.title}>
                                    <h2 className={textCn('rs-h2')}>
                                        Go server-side with Spring
                                    </h2>
                                </div>
                                <div className={styles.text}>
                                    <p className={textCn('rs-text-2')}>
                                        Use Kotlin with the familiar Spring framework to build powerful enterprise
                                        applications.
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

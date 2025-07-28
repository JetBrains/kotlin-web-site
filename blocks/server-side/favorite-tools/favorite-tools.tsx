import React, { FC } from 'react';

import cn from 'classnames';

import styles from './favorite-tools.module.css';
import { useTextStyles } from '@rescui/typography';
import { Button } from '@rescui/button';
import Image from 'next/image';

import { ArrowTopRightIcon } from '@rescui/icons';

import ToolsImage1 from './images/tools-screen-1.png';
import ToolsImage2 from './images/tools-screen-2.png';

export const FavoriteTools: FC = ({}) => {

    const textCn = useTextStyles();

    return (
        <section className="ktl-layout ktl-layout--center">
            <div className="ktl-container section-offset">

                <h2 className={cn(textCn('rs-h1'))}>
                    Use your favorite tools
                </h2>

                <div className="ktl-row ktl-offset-top-l">
                    <div className="ktl-col-12 ktl-col-sm-8">
                        <Image src={ToolsImage1} alt={'IDE support'} className={styles.image} />
                    </div>
                    <div className="ktl-col-12 ktl-col-sm-4">
                        <h3 className={cn(textCn('rs-h3'), styles.sectionTitle)}>
                            IDE support
                        </h3>

                        <p className={textCn('rs-text-2')}>
                            For a Java developer, getting started with Kotlin is very easy. Kotlin is natively supported
                            in IntelliJ IDEA, and the automated Java-to-Kotlin converter is there to help you with your
                            first steps. The powerful refactoring, navigation, and static code analysis features make
                            programming in Kotlin a pleasure!
                        </p>

                        <Button
                            href={'https://www.jetbrains.com/idea/download/?_gl=1*1ujcke8*_gcl_au*MTA0OTU3NjY2Mi4xNzUyMjQzNjU3*_ga*MTg1NzExNDA3My4xNzUyMjQzNjY0*_ga_9J976DJZ68*czE3NTMyNzIzOTYkbzgkZzAkdDE3NTMyNzIzOTYkajYwJGwwJGgw'}
                            size={'l'} mode={'outline'} icon={<ArrowTopRightIcon />}
                            iconPosition={'right'}>Download</Button>
                    </div>
                </div>

                <div className="ktl-row ktl-offset-top-xl">
                    <div className="ktl-col-12 ktl-col-sm-4">
                        <h3 className={cn(textCn('rs-h3'), styles.sectionTitle)}>
                            Build tools
                        </h3>

                        <p className={textCn('rs-text-2')}>
                            Use your favorite build tool for building Kotlin programs. Plugins are available for <a
                            className={textCn('rs-link')}
                            href={'https://kotlinlang.org/docs/reference/using-gradle.html'}>Gradle</a>, <a
                            className={textCn('rs-link')}
                            href={'https://kotlinlang.org/docs/reference/using-maven.html'}>Maven</a>, <a
                            className={textCn('rs-link')}
                            href={'https://kotlinlang.org/docs/reference/using-ant.html'}>Ant</a>, and&nbsp;
                            <a className={textCn('rs-link')} href={'https://github.com/bazelbuild/rules_kotlin'}>Bazel
                                ↗</a>
                        </p>
                    </div>
                    <div className="ktl-col-12 ktl-col-sm-8">
                        <Image src={ToolsImage2} alt={'Build tools'} className={styles.image} />
                    </div>
                </div>

            </div>
        </section>
    );
};

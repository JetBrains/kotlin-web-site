import React, { FC } from 'react';

import cn from 'classnames';

import styles from './how-to-start.module.css';
import { useTextStyles } from '@rescui/typography';

import {ArrowRightIcon} from '@rescui/icons';

import { CodeHighlight } from '../../../components/code-highlight/code-highlight';

const codeSample = `data class User(val name: String, val age: Int)

@Test fun \`should return valid user when input correct\`() {
    val repo = mockk<UserRepository>()
    every { repo.findById(any()) } returns User("John", 30)
    val service = UserService(repo)
    assertEquals(User("John", 30), service.getUser("test-id"))
}`;


export const HowToStart: FC = ({}) => {

    const textCn = useTextStyles();

    return (
        <section className="ktl-layout ktl-layout--center">
            <div className="ktl-container section-offset">

                <h2 className={cn(textCn('rs-h1'))}>
                    How to start – incremental adoption in Java projects
                </h2>

                <h3 className={textCn('rs-subtitle-2')}>
                    Because of Kotlin’s full interoperability with Java, <br />
                    teams can introduce it gradually:
                </h3>

                <div className="ktl-row ktl-offset-top-l">
                    <div className="ktl-col ">

                        <div className={styles.items}>
                            <div className={styles.item}>
                                <ArrowRightIcon theme={'dark'} className={styles.icon} />
                                <p className={cn(textCn('rs-text-2'), styles.title)}>
                                    Full interop with Java allows using any JVM library or framework
                                </p>
                            </div>
                            <div className={styles.item}>
                                <ArrowRightIcon theme={'dark'} className={styles.icon} />
                                <p className={cn(textCn('rs-text-2'), styles.title)}>
                                    Implement new services from scratch in Kotlin using your existing framework (Spring, Quarkus, JEE, etc.).
                                </p>
                            </div>
                            <div className={styles.item}>
                                <ArrowRightIcon theme={'dark'} className={styles.icon} />
                                <p className={cn(textCn('rs-text-2'), styles.title)}>
                                    Develop new features in Kotlin within existing Java projects.
                                </p>
                            </div>
                            <div className={styles.item}>
                                <ArrowRightIcon theme={'dark'} className={styles.icon} />
                                <p className={cn(textCn('rs-text-2'), styles.title)}>
                                    Gradually convert your existing Java codebase to Kotlin.
                                </p>
                            </div>
                        </div>

                    </div>

                    <div className={cn("ktl-col", styles.codeSample)}>
                        <CodeHighlight code={codeSample} className={styles.codeBlock} />
                    </div>

                </div>

            </div>
        </section>
    );
};

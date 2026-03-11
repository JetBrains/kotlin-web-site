import cn from 'classnames';
import { Accordion, Collapse } from '@rescui/collapse';
import { useTextStyles } from '@rescui/typography';

import styles from './faq-block.module.css';

export const FaqBlock = () => {
    const textCn = useTextStyles();
    const linkClass = textCn('rs-link', { hardness: 'hard' });

    return (
        <Accordion>
            <div className={cn(styles.section, 'ktl-layout ktl-layout--center')}>
                <div className={'ktl-row'}>
                    <div className="ktl-col-12 ktl-col-md-6">
                        <Collapse title={'What is Kotlin Multiplatform?'}>
                            Kotlin Multiplatform is a technology that allows you to create applications for various
                            platforms and efficiently reuse code across them while retaining the benefits of native
                            programming. Your applications will run on iOS, Android, macOS, Windows, Linux, and more.
                        </Collapse>
                        <Collapse
                            title={'What’s the difference between Kotlin Multiplatform and Compose Multiplatform?'}
                        >
                            Kotlin Multiplatform is the core technology that lets you share code – such as business
                            logic, data models, networking, and more – across multiple platforms, including Android,
                            iOS, desktop, web, and server. It focuses on code reuse without replacing the native UI
                            unless you want it to.<br />
                            <a className={linkClass} href={'/compose-multiplatform/'}>
                                Compose Multiplatform
                            </a>{' '}
                            is an optional UI framework built on top of Kotlin Multiplatform. It allows you to share
                            your user interface across platforms using a modern, declarative approach similar to Jetpack
                            Compose on Android. You can use it to build visually appealing, responsive UIs for Android,
                            iOS, desktop, and web from a single codebase.
                        </Collapse>
                        <Collapse title={'Are Kotlin Multiplatform and Compose Multiplatform ready for production?'}>
                            Yes, Kotlin Multiplatform is production-ready for all supported platforms – Android, iOS,
                            desktop, web, and server. Compose Multiplatform is stable for Android, iOS, and desktop,
                            while the web target is currently in Beta.
                        </Collapse>
                    </div>

                    <div className="ktl-col-12 ktl-col-md-6">
                        <Collapse
                            title={
                                'Where should I choose Kotlin Multiplatform (KMP) over other cross-platform solutions?'
                            }
                        >
                            <p>Choose Kotlin Multiplatform when you need:</p>
                            <ul className={textCn('rs-ul')}>
                                <li>
                                    <strong>Incremental adoption:</strong> KMP lets you share code selectively – start
                                    with a single module or expand to your full app at your own pace.
                                </li>
                                <li>
                                    <strong>Native performance:</strong> KMP compiles to native code for each platform
                                    with no bridges or VMs, ensuring high performance and responsiveness.
                                </li>
                                <li>
                                    <strong>Truly native UI with Compose Multiplatform:</strong> Compose Multiplatform
                                    respects each platform's UI conventions, offering a native-feeling experience across
                                    Android, iOS, desktop, and web.
                                </li>
                                <li>
                                    <strong>The same tools and architecture as Kotlin and Jetpack Compose:</strong> Your
                                    skills will transfer easily, reducing onboarding and ramp-up time.
                                </li>
                                <li>
                                    <strong>Direct access to platform APIs:</strong> You can call native APIs directly –
                                    with no wrappers needed and zero time wasted waiting for framework updates.
                                </li>
                                <li>
                                    <strong>Escape hatches for native code:</strong> You can write fully native code
                                    where needed (e.g. for performance-critical components), without having to abandon
                                    the cross-platform approach.
                                </li>
                            </ul>
                            Learn more about{' '}
                            <a className={linkClass} href="/docs/multiplatform/kotlin-multiplatform-flutter.html">
                                KMP and Flutter
                            </a>{' '}
                            and{' '}
                            <a className={linkClass} href="/docs/multiplatform/kotlin-multiplatform-react-native.html">
                                KMP and React Native
                            </a>
                            .
                        </Collapse>

                        <Collapse title={'Do I have to rewrite my app to use KMP?'}>
                            No. You can start small by sharing a module or feature and integrating it into your existing
                            app. KMP is designed for gradual adoption, making it easy to incrementally introduce
                            cross-platform code.
                        </Collapse>
                    </div>
                </div>
            </div>
        </Accordion>
    );
};

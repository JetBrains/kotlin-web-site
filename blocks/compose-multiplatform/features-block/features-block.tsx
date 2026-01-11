import React from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { useTL } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

import codePlatformsImage from '../../../public/images/compose-multiplatform/features-block/code-1.svg';
import codeDevicesImage from '../../../public/images/compose-multiplatform/features-block/code-2.svg';

import styles from './features-block.module.css';
import { TextSection } from './text-section';
import { CodeBlock } from './code-block';


const PlatformsCode = `Button(
    onClick = { 
        logger.info("Pressed!")
    },
) {
    Text("Hello $platform")
}
`;

const DeviceCode = `@Serializable
data class Friend(val name: String)

@Composable
fun FriendCard(name: String) {
    var myFriend by remember {
     mutableStateOf<Friend?>(null)
    }
    LaunchedEffect(name) {
        var friend = ktorClient
            .get("$host/$name.json")
            .body<Friend>()
        myFriend = friend 
    }
    // ...
}
`;

export const FeaturesBlock = () => {
    const textCn = useTextStyles();
    const isTL = useTL();

    return (
        <section className={styles.featuresBlock} data-testid="features-block">
            <div className={cn('ktl-layout', ' ktl-layout--center')}>
                <div className={styles.wrapper}>
                    <TextSection title={'Native feel and easy interop'}>
                        Compose Multiplatform delivers native-quality UIs, with smooth scrolling at display-native
                        framerates, responsive text editing, and platform-specific gestures support. Thanks to{' '}
                        <a href={'/multiplatform/'} className={textCn('rs-link')}>
                            Kotlin Multiplatform
                        </a>
                        , you can easily access native APIs to integrate features like maps, camera, and video – without
                        compromising on performance or user experience.
                    </TextSection>

                    <TextSection title={'Android skills, multiplatform reach'}>
                        Use your Jetpack Compose skills across platforms. Compose Multiplatform supports familiar APIs
                        like state management, layout, and animations as well as Material components, making it easy to
                        bring your Android architecture to other platforms.
                    </TextSection>

                    {isTL && (
                        <div className={styles.codeSection}>
                            <CodeBlock codeSample={PlatformsCode} imageSrc={codePlatformsImage} />
                        </div>
                    )}

                    <TextSection title={'Gradual adoption'}>
                        Start small or go all in without extra work – Compose Multiplatform fits into your existing app,
                        whether you’re sharing one component, one screen, or the entire UI. Keep your existing SwiftUI,
                        Android Views, or Swing code – there’s no need to rewrite anything. Learn from the{' '}
                        <a href={'/docs/multiplatform/case-studies.html'} className={textCn('rs-link')}>
                            experience of other companies
                        </a>
                        .
                    </TextSection>

                    {isTL && (
                        <div className={styles.codeSection}>
                            <CodeBlock codeSample={DeviceCode} imageSrc={codeDevicesImage} />
                        </div>
                    )}

                    <TextSection title={'Hot Reload'}>
                        Tweak and preview your UI instantly without restarting on desktop with{' '}
                        <a href={'/docs/multiplatform/compose-hot-reload.html'} className={textCn('rs-link')}>
                            Compose Hot Reload
                        </a>
                        , speeding up your development workflow.
                    </TextSection>

                    <TextSection title={'Seamless tooling'}>
                        Enjoy smart IDE support with the{' '}
                        <a
                            href="https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform"
                            className={textCn('rs-link')}
                        >
                            KMP plugin
                        </a>{' '}
                        for{' '}
                        <a href={'https://jetbrains.com/idea/download/'} className={textCn('rs-link')}>
                            IntelliJ IDEA
                        </a>{' '}
                        and{' '}
                        <a
                            href="https://developer.android.com/studio/"
                            className={textCn('rs-link', { external: true })}
                            target="_blank"
                        >
                            Android Studio
                        </a>
                        , with common previews, cross-language navigation, refactorings, and debugging across Kotlin and
                        Swift code.
                    </TextSection>

                    <TextSection title={'AI-powered code generation'}>
                        Speed up your UI coding with code generation powered by{' '}
                        <a href={'https://jetbrains.com/junie/'} className={textCn('rs-link')}>
                            Junie
                        </a>
                        , the coding agent by JetBrains. Compose Multiplatform shares its API with Jetpack Compose. As a
                        result, LLMs are already well-trained, helping you generate UI components and complete screens
                        faster than ever.
                    </TextSection>

                    <TextSection title={'A thriving ecosystem'}>
                        Leverage a{' '}
                        <a href="https://klibs.io/" className={textCn('rs-link', { external: true })} target="blank">
                            rich set of production-ready Kotlin Multiplatform libraries
                        </a>
                        , including{' '}
                        <a
                            href="https://developer.android.com/kotlin/multiplatform"
                            className={textCn('rs-link', { external: true })}
                            target="blank"
                        >
                            official multiplatform Jetpack libraries
                        </a>
                        . Join a growing community that’s shaping the future of cross-platform development.
                    </TextSection>

                    {!isTL && (
                        <div className={styles.codeColumn}>
                            <div className={styles.codeSection}>
                                <CodeBlock codeSample={PlatformsCode} imageSrc={codePlatformsImage} />
                            </div>

                            <div className={styles.codeSection}>
                                <CodeBlock codeSample={DeviceCode} imageSrc={codeDevicesImage} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeaturesBlock;

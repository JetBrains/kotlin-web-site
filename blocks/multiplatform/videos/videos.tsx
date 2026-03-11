import { useTextStyles } from '@rescui/typography';
import { HighlightedBg } from '../highlighted-bg/highlighted-bg';
import { VideoBlock } from './video-block/video-block';


export function CoolVideos() {
    const textCn = useTextStyles();
    const linkClass = textCn('rs-link');

    return <HighlightedBg>
        <VideoBlock
            title={'AI-powered code generation'}
            source={'https://resources.jetbrains.com/storage/products/kotlin/landings/kmp_and_junie.mp4'}
            iconPath={'/images/multiplatform/video-block/junie.svg'}
            textWidthLimit={'917px'}
        >
            Speed up your multiplatform coding with code generation powered by{' '}
            <a className={linkClass} href={'https://www.jetbrains.com/junie/'}>Junie</a>, the coding agent by
            JetBrains.
        </VideoBlock>

        <VideoBlock
            title={'Seamless tooling'}
            source={'https://resources.jetbrains.com/storage/products/kotlin/landings/kmp_compose_hot_reload.mp4'}
            iconPath={'/images/multiplatform/video-block/infinity.svg'}
            textWidthLimit={'993px'}
        >
            Enjoy smart IDE support with the{' '}
            <a className={linkClass} href={'https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform'}>KMP
                plugin</a>{' '}for{' '}
            <a className={linkClass} href={'https://www.jetbrains.com/idea/download/'}>IntelliJ
                IDEA</a>{' '}and{' '}
            <a className={linkClass} href={'https://developer.android.com/studio'}>Android Studio</a>, with common
            previews,
            cross-language navigation, refactorings, and debugging across Kotlin and Swift code.
        </VideoBlock>
    </HighlightedBg>;
}
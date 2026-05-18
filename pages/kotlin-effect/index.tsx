import React from 'react';
import { Button } from '@rescui/button';
import { LandingLayout } from '../../components/landing-layout/landing-layout';
import { CardStack } from '@/blocks/kotlin-effect/card-stack/card-stack';
import { KotlinEffectPlaceholder } from '../../blocks/kotlin-effect/placeholder/placeholder';

export const KOTLIN_EFFECT_TITLE = 'Kotlin Effect';
export const KOTLIN_EFFECT_URL = '/kotlin-effect/';

const TOP_MENU_ITEMS = [
    {
        url: '/kotlin-effect/',
        title: 'Kotlin Effect'
    }
];

function Index() {
    return (
        <LandingLayout
            title="The Kotlin Effect | Write Less. Do More."
            ogImageName={''}
            description="Discover the Kotlin Effect. Write less code, do more, and enjoy the process. Watch the video, play the game, and explore learning resources."
            currentTitle={KOTLIN_EFFECT_TITLE}
            currentUrl={KOTLIN_EFFECT_URL}
            topMenuTitle={KOTLIN_EFFECT_TITLE}
            topMenuHomeUrl={KOTLIN_EFFECT_URL}
            topMenuItems={TOP_MENU_ITEMS}
            topMenuButton={<Button href="https://kotlinlang.org/docs/getting-started.html">Get started</Button>}
            dataTestId={'kotlin-effect-page'}
        >
            <KotlinEffectPlaceholder />
            <CardStack />
            <KotlinEffectPlaceholder />
        </LandingLayout>
    );
}

export default Index;

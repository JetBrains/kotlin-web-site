import React, { ReactNode } from 'react';

import DiamondIcon from '../../server-side/features-section/diamond.svg';

import MultiplatformIcon from '@/blocks/main/hero-ab/images/icons/multiplatform.svg';
import BackendIcon from '@/blocks/main/hero-ab/images/icons/backend.svg';
import AndroidIcon from '@/blocks/main/hero-ab/images/icons/android.svg';
import AIIcon from '@/blocks/main/hero-ab/images/icons/ai.svg';

interface FeatureItem {
    id: string;
    icon: ImgSrc;
    title: string;
    description: ReactNode;
}

interface FeatureSlideItem extends FeatureItem {
    codeSample: string;
}

const codeSample = `fun main() {
    val name = "stranger"        // Declare your first variable
    println("Hi, $name!")        // ...and use it!
    print("Current count:")
    for (i in 0..10) {           // Loop over a range from 0 to 10
        print(" $i")
    }
}`;

export const heroPlatformItems: FeatureSlideItem[] = [
    {
        id: 'multiplatform',
        icon: MultiplatformIcon,
        title: 'Multiplatform',
        description: 'Android mobile development has been Kotlin-first since Google I/O in 2019.',
        codeSample,
    },
    {
        id: 'backend',
        icon: BackendIcon,
        title: 'Backend',
        description: 'Android mobile development has been Kotlin-first since Google I/O in 2019.',
        codeSample,
    },
    {
        id: 'android',
        icon: AndroidIcon,
        title: 'Android',
        description: 'Android mobile development has been Kotlin-first since Google I/O in 2019.',
        codeSample,
    },
    {
        id: 'ai',
        icon: AIIcon,
        title: 'AI',
        description: 'Android mobile development has been Kotlin-first since Google I/O in 2019.',
        codeSample,
    },
];

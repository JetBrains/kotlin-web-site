import React from 'react';
import { createTextCn } from '@rescui/typography';

import GalleryImg1 from '../../../public/images/compose-multiplatform/hero/gallery-img-1.png';
import GalleryImg2 from '../../../public/images/compose-multiplatform/hero/gallery-img-2.png';
import GalleryImg3 from '../../../public/images/compose-multiplatform/hero/gallery-img-3.png';
import GalleryImg4 from '../../../public/images/compose-multiplatform/hero/gallery-img-4.png';
import GalleryImg5 from '../../../public/images/compose-multiplatform/hero/gallery-img-5.png';
import GalleryImg6 from '../../../public/images/compose-multiplatform/hero/gallery-img-6.png';
import GalleryImg7 from '../../../public/images/compose-multiplatform/hero/gallery-img-7.png';
import GalleryImg8 from '../../../public/images/compose-multiplatform/hero/gallery-img-8.png';

const textCn = createTextCn('dark');

export const ComposeMultiplatformGalleryItems = [
    {
        image: GalleryImg3,
        description: (
            <p className={textCn('rs-text-2', { hardness: 'hard' })}>
                Feres, a taxi app with 1M+ downloads, shares all business logic with
                KMP and 90% of its UI using Compose Multiplatform.
            </p>
        )
    },
    {
        image: GalleryImg1,
        description: (
            <p className={textCn('rs-text-2', { hardness: 'hard' })}>
                Markaz, Pakistan’s e-commerce platform with 5M+ downloads, has 100+
                screens built entirely with Compose Multiplatform.
            </p>
        )
    },
    {
        image: GalleryImg5,
        description: (
            <p className={textCn('rs-text-2', { hardness: 'hard' })}>
                Respawn, your coach on lasting habits, is using Compose Multiplatform
                with 96% shared code.
            </p>
        )
    },
    {
        image: GalleryImg7,
        description: (
            <p className={textCn('rs-text-2', { hardness: 'hard' })}>
                The Fast&Fit app shares over 90% of its codebase – including the
                entire UI – using KMP and Compose Multiplatform.
            </p>
        )
    },
    {
        image: GalleryImg6,
        description: (
            <p className={textCn('rs-text-2', { hardness: 'hard' })}>
                Music Work, a playlist player with brand-tailored content, is built
                with Compose Multiplatform for mobile, desktop, and web.
            </p>
        )
    },
    {
        image: GalleryImg4,
        description: (
            <p className={textCn('rs-text-2', { hardness: 'hard' })}>
                Physics Wallah, an educational platform with 17M active users, unified
                both UI and business logic across iOS and Android.
            </p>
        )
    },
    {
        image: GalleryImg2,
        description: (
            <p className={textCn('rs-text-2', { hardness: 'hard' })}>
                Wrike apps feature Calendars, Boards, Dashboards, Charts, Timesheet
                Approvals, and more – all done with Compose Multiplatform.
            </p>
        )
    },
    {
        image: GalleryImg8,
        description: (
            <p className={textCn('rs-text-2', { hardness: 'hard' })}>
                BiliBili (China version) has adopted Kotlin Multiplatform and Compose
                Multiplatform for the Instant Message feature.
            </p>
        )
    }
];

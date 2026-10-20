import React from 'react';
import { createTextCn } from '@rescui/typography';

import GalleryImgMarkaz from '../../../public/images/compose-multiplatform-redesign/hero/gallery-img-markaz.png';
import GalleryImgWrike from '../../../public/images/compose-multiplatform-redesign/hero/gallery-img-wrike.png';
import GalleryImgFeres from '../../../public/images/compose-multiplatform-redesign/hero/gallery-img-feres.png';
import GalleryImgPhysicsWallah from '../../../public/images/compose-multiplatform-redesign/hero/gallery-img-physics-wallah.png';
import GalleryImgBilibili from '../../../public/images/compose-multiplatform-redesign/hero/gallery-img-bilibili.png';
import GalleryImgInstabox from '../../../public/images/compose-multiplatform-redesign/hero/gallery-img-instabox.png';
import GalleryImgPocketBard from '../../../public/images/compose-multiplatform-redesign/hero/gallery-img-pocket-bard.png';
import GalleryImgFabuly from '../../../public/images/compose-multiplatform-redesign/hero/gallery-img-fabuly.png';

const textCn = createTextCn('dark');

// The mock draws one slide (Markaz, copy verbatim from the mock); the other slides repeat the shipped
// compose-multiplatform page's case studies so the carousel mechanism can be operated (R12).
export const HERO_GALLERY_ITEMS = [
    {
        image: GalleryImgMarkaz,
        description: (
            <p className={textCn('rs-text-2', { hardness: 'hard' })}>
                Markaz, Pakistan’s e-commerce platform with 5M+ downloads, has 100+ screens built entirely with Compose
                Multiplatform.
            </p>
        ),
    },
    {
        image: GalleryImgFeres,
        description: (
            <p className={textCn('rs-text-2', { hardness: 'hard' })}>
                Feres, a taxi app with 1M+ downloads, shares all business logic with KMP and 90% of its UI using Compose
                Multiplatform.
            </p>
        ),
    },
    {
        image: GalleryImgInstabox,
        description: (
            <p className={textCn('rs-text-2', { hardness: 'hard' })}>
                Instabox, the Nordic parcel-delivery app with 340K+ installs in Sweden alone, shares almost all of its
                UI across Android and iOS while keeping maps, camera, and video fully native.
            </p>
        ),
    },
    {
        image: GalleryImgPocketBard,
        description: (
            <p className={textCn('rs-text-2', { hardness: 'hard' })}>
                Pocket Bard, an interactive audio companion for tabletop RPGs with 750K+ downloads, ships its entire UI
                from a&nbsp;single Compose Multiplatform codebase.
            </p>
        ),
    },
    {
        image: GalleryImgFabuly,
        description: (
            <p className={textCn('rs-text-2', { hardness: 'hard' })}>
                Fabuly, a classic-audiobooks subscription service with 350K+ downloads, has built its entire UI with
                Compose Multiplatform since January 2024, with 173 releases so far.
            </p>
        ),
    },
    {
        image: GalleryImgPhysicsWallah,
        description: (
            <p className={textCn('rs-text-2', { hardness: 'hard' })}>
                Physics Wallah, an educational platform with 17M active users, unified both UI and business logic across
                iOS and Android.
            </p>
        ),
    },
    {
        image: GalleryImgWrike,
        description: (
            <p className={textCn('rs-text-2', { hardness: 'hard' })}>
                Wrike apps feature Calendars, Boards, Dashboards, Charts, Timesheet Approvals, and more – all done with
                Compose Multiplatform.
            </p>
        ),
    },
    {
        image: GalleryImgBilibili,
        description: (
            <p className={textCn('rs-text-2', { hardness: 'hard' })}>
                BiliBili (China version) has adopted Kotlin Multiplatform and Compose Multiplatform for the Instant
                Message feature.
            </p>
        ),
    },
];

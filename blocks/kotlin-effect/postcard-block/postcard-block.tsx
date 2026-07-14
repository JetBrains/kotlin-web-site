import React from 'react';
import cn from 'classnames';
import { createTextCn } from '@rescui/typography';
import { PostCard } from '@webteam/postcard-section';

import greetingCard from './images/greeting-card.png';
import postcard from './images/postcard.png';

import styles from './postcard-block.module.css';

export const PostcardBlock = () => {
    const darkTextCn = createTextCn('dark');

    return (
        <div className={styles.postcardBlock} id="postcard-section">
            <h2 className={cn(darkTextCn('rs-h1'), styles.title)}>
                <span>15 years of Kotlin.</span>
                <br />
                Thank you for being part of the journey!
            </h2>
            <h3 className={cn(darkTextCn('rs-subtitle-2', { hardness: 'hard' }), styles.text)}>
                Mark this milestone by writing a birthday wish, making a bold prediction for Kotlin’s future, or
                uploading your photo to keep Kodee company on this special occasion.
            </h3>
            <PostCard
                consentHref='/kotlin-effect/terms'
                theme="dark"
                mask={postcard.src}
                className={styles.card}
                altMaskTitle="Post card image"
                dropzonePosition={{
                    top: '11.5%',
                    left: '32%',
                    width: '35.5%',
                    height: '43%',
                }}
            />
            <div className={styles.greetingCardBlock}>
                <PostCard
                    consentHref='/kotlin-effect/terms'
                    theme="dark"
                    type="text"
                    mask={greetingCard.src}
                    className={styles.card}
                    altMaskTitle="Greeting card image"
                />
            </div>
        </div>
    );
};

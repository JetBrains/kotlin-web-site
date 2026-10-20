import React, { FC } from 'react';
import cn from 'classnames';
import { createTextCn } from '@rescui/typography';

import { ANDROID_SKILLS_EVERY_COPY, ANDROID_SKILLS_EVERY_STATS } from './android-skills-every-data';

import styles from './android-skills-every.module.css';

const [TITLE, SUBTITLE, LEAD, SHOWCASE_TITLE] = ANDROID_SKILLS_EVERY_COPY.map((item) => item.text);

export const AndroidSkillsEverySection: FC = () => {
    const textCnLight = createTextCn('light');
    const textCnDark = createTextCn('dark');

    return (
        <section
            className={styles.wrapper}
            id="android-skills-every"
            data-testid="compose-multiplatform-redesign-android-skills-every"
        >
            <div className={styles.intro}>
                <div className={styles.introHead}>
                    <h2
                        className={cn(styles.text, textCnLight('rs-h1'), styles.title)}
                        data-testid="compose-multiplatform-redesign-android-skills-every-title"
                    >
                        {TITLE}
                    </h2>
                    <p className={cn(styles.text, textCnLight('rs-subtitle-2'), styles.subtitle)}>{SUBTITLE}</p>
                </div>
                <p className={cn(styles.text, textCnLight('rs-text-1', { hardness: 'hard' }), styles.lead)}>{LEAD}</p>
            </div>

            <div className={styles.grid}>
                <div className={cn(styles.card, styles.showcase)}>
                    <h3 className={cn(styles.text, textCnDark('rs-h1'), styles.showcaseTitle)}>{SHOWCASE_TITLE}</h3>
                    <div className={styles.phone}>
                        <img
                            src="/images/compose-multiplatform-redesign/android-skills-phone.png"
                            alt="Phone home screen with apps built with Compose Multiplatform: Perk, Sony, bilibili, Tencent Video, Andalusi, Alipay, Booking, Wrike, Bitkey, Meshtastic, Saucillator, Syarah"
                            width={1816}
                            height={3760}
                            className={styles.phoneImage}
                        />
                    </div>
                </div>
                <div className={styles.stats}>
                    {ANDROID_SKILLS_EVERY_STATS.map(({ value, text }) => (
                        <div key={value} className={cn(styles.card, styles.stat)}>
                            <p className={cn(styles.text, textCnDark('rs-h1'))}>{value}</p>
                            <p className={cn(styles.text, textCnDark('rs-text-1'))}>{text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

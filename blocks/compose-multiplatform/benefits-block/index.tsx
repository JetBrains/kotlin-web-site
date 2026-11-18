import cn from 'classnames';
import Img, { StaticImageData } from 'next/image';
import { createTextCn } from '@rescui/typography';
import styles from './benefits-block.module.css';

import alipayLogo from './images/alipay.svg';
import andalusiLogo from './images/andalusi.svg';
import bilibiliLogo from './images/bilibili.svg';
import bitkeyLogo from './images/bitkey.svg';
import bookingLogo from './images/booking.svg';
import meshtasticLogo from './images/meshtastic.svg';
import perkLogo from './images/perk.svg';
import saucillatorLogo from './images/saucillator.svg';
import sonyLogo from './images/sony.svg';
import syarahLogo from './images/syarah.svg';
import tencentVideoLogo from './images/tencent-video.svg';
import wrikeLogo from './images/wrike.svg';
import casesMobileImage from './images/cases-mobile.png';

type CaseItem = {
    name: string;
    logo: StaticImageData;
};

const CASES: CaseItem[] = [
    { name: 'Perk', logo: perkLogo },
    { name: 'Sony', logo: sonyLogo },
    { name: 'bilibili', logo: bilibiliLogo },
    { name: 'Tencent Video', logo: tencentVideoLogo },
    { name: 'Andalusi', logo: andalusiLogo },
    { name: 'Alipay', logo: alipayLogo },
    { name: 'Booking', logo: bookingLogo },
    { name: 'Wrike', logo: wrikeLogo },
    { name: 'Bitkey', logo: bitkeyLogo },
    { name: 'Meshtastic', logo: meshtasticLogo },
    { name: 'Saucillator', logo: saucillatorLogo },
    { name: 'Syarah', logo: syarahLogo },
];

type StatItem = {
    value: string;
    text: string;
};

const STATS: StatItem[] = [
    { value: '2×', text: 'more top 10K apps use Kotlin Multiplatform than a year ago' },
    { value: '81%', text: 'of Kotlin Multiplatform developers use Compose Multiplatform' },
    { value: '93%', text: 'of developers report a native-like experience with Compose Multiplatform on iOS' },
];

export const BenefitsBlock = () => {
    const textCn = createTextCn('light');
    const textCnDark = createTextCn('dark');
    return (
        <section className={cn(styles.benefits, 'ktl-layout', 'ktl-layout--center')}>
            <div className={styles.wrapper} data-testid={'benefits-block'}>
                <div className={styles.intro}>
                    <div className={cn(textCn('rs-h1'), styles.title)}>
                        Android skills. Every platform.
                    </div>
                    <div className={cn(textCn('rs-subtitle-2'), styles.subtitle)}>
                        Use your Jetpack Compose skills across platforms.
                    </div>
                    <div
                        className={textCn('rs-text-1', { hardness: 'hard' })}
                    >
                        Compose Multiplatform supports familiar APIs like state management, layout, and animations as well as Material components, making it easy to bring your Android architecture to other platforms.
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={cn(styles.card, styles.showcase)}>
                        <div className={cn(textCnDark('rs-h1'), styles.showcaseTitle)}>
                            Production-ready for&nbsp;mobile and desktop
                        </div>
                        <ul className={styles.cases} data-testid="benefits-block-cases">
                            {CASES.map(({ name, logo }) => (
                                <li key={name} className={styles.case}>
                                    <Img src={logo} alt="" className={styles.caseLogo} />
                                    <span className={cn(textCnDark('rs-text-2', { hardness: 'hard' }), styles.caseName)}>{name}</span>
                                </li>
                            ))}
                        </ul>
                        <Img
                            src={casesMobileImage}
                            alt={CASES.map(({ name }) => name).join(', ')}
                            className={styles.casesMobile}
                        />
                    </div>
                    {STATS.map(({ value, text }) => (
                        <div key={value} className={cn(styles.card, styles.stat)} data-testid="benefits-block-stat">
                            <div className={cn(textCnDark('rs-h1'), styles.statValue)}>{value}</div>
                            <div className={textCnDark('rs-text-1', { hardness: 'hard' })}>{text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

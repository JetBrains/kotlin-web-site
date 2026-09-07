import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { useTextStyles } from '@rescui/typography';
import meetupsDataRaw from '../../../data/kotlin-effect/anniversary-meetups.yml';
import { AnniversaryMeetupEntity, MeetupsMap } from './meetups-map';
import { MeetupsList } from './meetups-list';
import styles from './meetups-block.module.css';

const meetupsData = meetupsDataRaw as AnniversaryMeetupsData;

export const MeetupsBlock: FC = () => {
    const textCn = useTextStyles();

    const meetups: AnniversaryMeetupEntity[] = useMemo(
        () => meetupsData.map((meetup) => ({ ...meetup, id: `${meetup.name}-${meetup.date}` })),
        []
    );

    return (
        <div className={styles.meetupsSection} id={'meetups'} data-test={'meetups-block'}>
            <h2 className={cn(textCn('rs-h1'), styles.sectionTitle)}>
                Join the Celebration <span>Near You</span>
            </h2>
            <p className={cn(textCn('rs-subtitle-2'), styles.sectionSubtitle)}>
                Find a birthday meetup in your city and celebrate with Kotlin enthusiasts around the world.
            </p>

            <div className={styles.mapContainer}>
                <MeetupsMap meetups={meetups} />
            </div>

            <MeetupsList meetups={meetups} />

            <div className={styles.cta}>
                <h3 className={cn(textCn('rs-h2'), styles.ctaTitle)}>No meetup in your area yet?</h3>
                <p className={cn(textCn('rs-text-1'), styles.ctaText)}>
                    Organize one! Get in touch, and we&apos;ll be happy to support your event.
                </p>
                <Button mode={'rock'} size={'l'} href="mailto:kug@jetbrains.com" className={styles.ctaButton}>
                    Get in touch
                </Button>
            </div>
        </div>
    );
};

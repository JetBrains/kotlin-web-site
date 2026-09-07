import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { AnniversaryMeetupEntity } from './meetups-map';
import { formatMeetupDay, formatMeetupMonth } from './meetups-date';
import styles from './meetups-list.module.css';

interface MeetupsListProps {
    meetups: AnniversaryMeetupEntity[];
}

interface MeetupMonth {
    title: string;
    meetups: AnniversaryMeetupEntity[];
}

// Sorts rather than trusting anniversary-meetups.yml to be date-ordered: a row appended out of
// order would otherwise open a second group for a month already emitted, duplicating both the
// heading and the React `key` below. 'YYYY-MM-DD' sorts chronologically as a plain string.
function groupByMonth(meetups: AnniversaryMeetupEntity[]): MeetupMonth[] {
    const months: MeetupMonth[] = [];

    [...meetups]
        .sort((a, b) => a.date.localeCompare(b.date))
        .forEach((meetup) => {
            const title = formatMeetupMonth(meetup.date);
            const month = months[months.length - 1];

            if (month?.title === title) {
                month.meetups.push(meetup);
            } else {
                months.push({ title, meetups: [meetup] });
            }
        });

    return months;
}

export const MeetupsList: FC<MeetupsListProps> = ({ meetups }) => {
    const textCn = useTextStyles();
    const months = useMemo(() => groupByMonth(meetups), [meetups]);

    return (
        <div className={styles.wrapper}>
            {months.map((month) => (
                <section className={styles.month} key={month.title}>
                    <h3 className={cn(textCn('rs-h3'), styles.monthTitle)}>{month.title}</h3>

                    <ul className={styles.list}>
                        {month.meetups.map((meetup) => (
                            <li className={styles.item} key={meetup.id}>
                                <span className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.date)}>
                                    {formatMeetupDay(meetup.date)}
                                </span>

                                {meetup.url ? (
                                    <a
                                        href={meetup.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cn(
                                            textCn('rs-text-2'),
                                            textCn('rs-link', { hardness: 'hard', mode: 'classic' }),
                                            styles.name
                                        )}
                                    >
                                        {meetup.name}
                                    </a>
                                ) : (
                                    <span className={cn(textCn('rs-text-2', { hardness: 'hard' }), styles.name)}>
                                        {meetup.name}
                                    </span>
                                )}

                                <span className={cn(textCn('rs-text-3', { hardness: 'average' }), styles.place)}>
                                    {meetup.city}, {meetup.country}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    );
};

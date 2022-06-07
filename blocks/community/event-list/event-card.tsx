import React, { FC } from 'react';
import { cardCn } from '@rescui/card';
import { Tag, presets } from '@rescui/tag';
import cn from 'classnames';
import { Preset } from '@rescui/tag/lib/parts/presets';
import styles from './event-card.module.css';
import { CommunityEvent } from './community-event';
import Button from '@rescui/button';
import { FilesIcon, YoutubeIcon } from '@rescui/icons';

interface EventCardProps {
    event: CommunityEvent;
}

const tagStyle: Preset = {
    ...presets.filledLight,
    color: '#27282c',
};

export const EventCard: FC<EventCardProps> = ({ event }) => {
    const cardClassName = cn(cardCn({ paddings: 16, isClickable: true }), `${styles.card} ktl-text-3`);

    return (
        <a className={cardClassName} href={event.url} target={'_blank'} rel="noopener noreferrer">
            <div className={styles.header}>
                <div>
                    {event.formattedDate}
                    {event.location && <span>, {event.location}</span>}
                </div>

                <div className={styles.tags}>
                    {event.online && (
                        <Tag {...tagStyle} isUppercase className={styles.tag}>
                            <span className={styles.dot}>•</span>Online
                        </Tag>
                    )}
                    <Tag {...tagStyle} isUppercase className={styles.tag}>
                        {event.lang}
                    </Tag>
                </div>
            </div>

            <div>
                <div className={styles.title}>
                    <h4 className="ktl-h4" dangerouslySetInnerHTML={{ __html: event.subject }} />

                    {event.content && (
                        <div className={styles.materials}>
                            {event.content.video && (
                                <Button
                                    href={event.content.video}
                                    target={'_blank'}
                                    /** @ts-ignore **/
                                    rel="noopener noreferrer"
                                    size={'s'}
                                    icon={<YoutubeIcon />}
                                />
                            )}

                            {event.content.slides && (
                                <Button
                                    href={event.content.slides}
                                    target={'_blank'}
                                    /** @ts-ignore **/
                                    rel="noopener noreferrer"
                                    size={'s'}
                                    icon={<FilesIcon />}
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.footerInfo}>
                    <div className={styles.speaker}>{event.speaker}</div>
                    <div dangerouslySetInnerHTML={{ __html: event.title }} />
                </div>
            </div>
        </a>
    );
};

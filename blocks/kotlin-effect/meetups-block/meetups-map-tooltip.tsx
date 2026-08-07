import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { CloseIcon } from '@rescui/icons';
import { createTextCn } from '@rescui/typography';
import { AnniversaryMeetupEntity } from './meetups-map';
import { formatMeetupDay } from './meetups-date';
import styles from './meetups-map-tooltip.module.css';

interface MeetupsMapTooltipProps {
    meetup: AnniversaryMeetupEntity;
    onClose: (key: string) => void;
}

// The tooltip sits on the light map surface, so it opts out of the page's dark theme.
const lightTextCn = createTextCn('light');

export const MeetupsMapTooltip: FC<MeetupsMapTooltipProps> = ({ meetup, onClose }) => {
    const handleClick = useCallback(
        (event) => {
            event.stopPropagation();
            onClose('');
        },
        [onClose]
    );

    return (
        <div className={styles.tooltip}>
            <div className={styles.content}>
                <div>
                    {meetup.url ? (
                        <a
                            href={meetup.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            // rs-link carries no font family of its own, hence the text class too.
                            className={cn(
                                lightTextCn('rs-text-2'),
                                lightTextCn('rs-link', { hardness: 'hard', mode: 'rock' })
                            )}
                        >
                            {meetup.name}
                        </a>
                    ) : (
                        <span className={lightTextCn('rs-text-2')}>{meetup.name}</span>
                    )}
                    <div className={cn(lightTextCn('rs-text-3', { hardness: 'average' }), styles.appendix)}>
                        {formatMeetupDay(meetup.date)} · {meetup.city}, {meetup.country}
                    </div>
                </div>

                <CloseIcon size="s" className={styles.closeIcon} onClick={handleClick} />
            </div>
        </div>
    );
};

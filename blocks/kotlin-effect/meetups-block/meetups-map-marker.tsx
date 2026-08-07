import React, { FC } from 'react';
import cn from 'classnames';
import { AnniversaryMeetupEntity } from './meetups-map';
import { MeetupsMapTooltip } from './meetups-map-tooltip';
import styles from './meetups-map-marker.module.css';

interface MeetupsMapMarkerProps {
    // Read by google-map-react to position the marker, not used in this component.
    lat: number;
    lng: number;
    meetup: AnniversaryMeetupEntity;
    showTooltip: boolean;
    onClose: (key: string) => void;
}

export const MeetupsMapMarker: FC<MeetupsMapMarkerProps> = ({ showTooltip, meetup, onClose }) => {
    return (
        <div className={cn(styles.marker, { [styles.active]: showTooltip })}>
            {showTooltip && <MeetupsMapTooltip meetup={meetup} onClose={onClose} />}
        </div>
    );
};

import React, { FC } from 'react';
import cn from 'classnames';
import styles from './teach-map-marker.module.css';
import { TeachMapTooltip } from './teach-map-tooltip';
import { University } from './teach-map';

interface TeachMapMarkerProps {
    lat: number;
    lng: number;
    university: University;
    showTooltip: boolean;
    onClose: () => void;
}

export const TeachMapMarker: FC<TeachMapMarkerProps> = ({ university, showTooltip, onClose }) => {
    return (
        <div className={cn(styles.marker, { [styles.active]: showTooltip })}>
            {showTooltip && <TeachMapTooltip university={university} onClose={onClose} />}
        </div>
    );
};
